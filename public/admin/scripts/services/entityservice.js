angular.module('dmt-back')
	.service('entityService', function ($http, $q) {
		return function (entity, filters, key) {
			let ctrl = this
			ctrl.currentEntity = null
			ctrl.language = null
			ctrl.key = key
			ctrl.entities = {}
			ctrl.options = {}
			function initRelation(relation, list, scope) {
				ctrl.entities[relation.entity] = {
					filter: {
						options: {
							debounce: 500
						}
					},
					bookmark: null,
					selected: [],
					query: {
						filter: '',
						order: null,
						filters: {},
						limit: 10,
						page: 1,
					},
					getData: function () { return scope.getEntityData(relation) },
					download: function () { return scope.downloadEntityData(relation) },
					search: function () { return scope.search(relation) }
				}
			}

			if (typeof entity === 'string') {
				ctrl.currentEntity = dmt.entities[entity]
			} else {
				ctrl.currentEntity = entity
			}
			
			
			if(ctrl.currentEntity){
				ctrl.currentEntity.relations = ctrl.currentEntity.relations || []
				initRelation({ entity: ctrl.currentEntity.name }, ctrl.entities, ctrl)
				ctrl.currentEntity.relations.forEach((relation) => {
					initRelation(relation, ctrl.entities, ctrl)
					if (relation.intermediate) {
						initRelation(relation.intermediate.entity, ctrl.entities, ctrl)
					}
				})
				if(ctrl.key){
					ctrl.entities[ctrl.currentEntity.name].query.filters = filters || {}
					ctrl.entities[ctrl.currentEntity.name].query.filters[ctrl.currentEntity.defaultSort] = [key]
				}
				if (filters) {
					ctrl.entities[ctrl.currentEntity.name].query.filters = filters
					for (var i in filters) {
						if (i === ctrl.currentEntity.defaultSort) {
							ctrl.key = filters[i][0]
						}
					}
				}
			}
			
			ctrl.data = {}

			function removeItems(item, index) {
				var base = relation.endpoint;
				var fields = [];
				ctrl.fields.forEach((field) => {
					if (field.key === "true" || field.key === true) {
						if (typeof item === 'object') {
							fields.push(field.name + "=" + item[field.name]);
						} else {
							fields.push(field.name + "=" + item);
						}
					}
				})
				var query = "?" + fields.join("&");
				var promise = $http.delete(base + query);
				promise.then(function () {
					items.splice(index, 1);
				});
				return promise;
			}
			ctrl.loadEntity = function(name){
				initRelation({entity:name}, ctrl.entities, ctrl)
			}
			ctrl.delete = function (items, relation) {
				$q.all(items.forEach(removeItems, relation)).then(onComplete).catch(error);
			}
			ctrl.updateItem = function (item, field, relation) {
				var deferred = $q.defer();
				let entity = dmt.entities[relation.entity];
				var data = new FormData();
				var update = false;
				entity.fields.forEach(function (field) {
					if (field.type !== 'file') {
						if (typeof item[field.name] === 'object' || typeof item[field.name] === 'array') {
							if ((item[field.name] instanceof Date)) {
								let _d = item[field.name].toISOString()
								_d = _d.split('T').join(' ').split('.')[0]
								data.append(field.name, _d)
							}
							return;
						}
						if (field.name === 'timestamp') {
							return;
						}
					}
					if (field.type === 'boolean') {
						data.append(field.name, item[field.name] === true ? 1 : 0)
						return;
					}
					if (!item[field.name]) {
						return;
					}
					if (field.name === entity.defaultSort) {
						update = true;
					}
					data.append(field.name, item[field.name])
				})
				var request = new XMLHttpRequest();
				if (update) {
					request.open("PUT", entity.endpoint);
				} else {
					request.open("POST", entity.endpoint);
				}
				request.setRequestHeader("Authorization", localStorage.getItem("token"))
				request.onload = function () {
					if (request.status === 200) {
						deferred.resolve(request.responseText)
					} else {
						deferred.reject(request.responseText)
					}
				}
				request.send(data)
				return deferred.promise
			}
			ctrl.save = function (data) {
				return ctrl.updateItem(data, null, {entity:ctrl.currentEntity.name})
			}
			ctrl.bind = function (selection,relation) {
				if (!relation || !ctrl.key) {
					return
				}
				if (relation.type === 'n-n') {
					var entity = dmt.entities[relation.intermediate.entity]
					var url = entity.endpoint
					var data = {}
					data[relation.intermediate.rightKey] = selection
					data[relation.intermediate.leftKey] = ctrl.key
					$http.post(url, data)
				}
			}
			ctrl.unbind = function (selection,relation) {
				if (!relation || !ctrl.key) {
					return
				}
				if (relation.type === 'n-n') {
					var entity = dmt.entities[relation.intermediate.entity]
					var url = entity.endpoint + '?' + relation.intermediate.rightKey + '=' + selection + '&' + relation.intermediate.leftKey + '=' + ctrl.key
					$http.delete(url)
				}
			}
			ctrl.search = function (relation) {
				if (ctrl.entities[relation.entity].bookmark == null) {
					ctrl.entities[relation.entity].bookmark = ctrl.entities[relation.entity].query.page;
				}
				ctrl.entities[relation.entity].query.page = 1;
				ctrl.entities[relation.entity].getData();
			}
			ctrl.removeFilter = function (relation) {
				ctrl.entities[relation.entity].filter.show = false;
				ctrl.entities[relation.entity].query.filter = '';
				ctrl.entities[relation.entity].query.page = ctrl.entities[relation.entity].bookmark;
				ctrl.entities[relation.entity].bookmark = null;
				if (ctrl.entities[relation.entity].filter.form.$dirty) {
					ctrl.entities[relation.entity].filter.form.$setPristine();
				}
				ctrl.entities[relation.entity].getData();
			}
			ctrl.getEntityData = function (relation) {
				var deferred = $q.defer();
				let str = ['simple=false'];
				let entity = dmt.entities[relation.entity];
				let table = null
				if (!entity) {
					entity = dmt.tables[relation.entity];
					table = entity
				} else {
					table = dmt.tables[entity.table]
				}
				if (ctrl.entities[relation.entity].query.order){
					str.push("order="+ctrl.entities[relation.entity].query.order)
				}
				if (ctrl.entities[relation.entity].query.filter.length) {
					str.push("filter=" + ctrl.entities[relation.entity].query.filter);
					table.fields.forEach((f) => {
						if (f.type === "string" || f.type === "text") {
							var name = f.name;
							if (f.prefix) {
								name = f.prefix + name
							}
							str.push("field=" + name);
						}
					})
				}
				for (let key in ctrl.entities[relation.entity].query.filters) {
					if (ctrl.entities[relation.entity].query.filters[key]) {
						ctrl.entities[relation.entity].query.filters[key].forEach((value) => {
							str.push("filter_field=" + key);
							str.push("filter_value=" + value);
						})
					}
				}
				if (relation.leftKey) { //1-n
					//str.push("limit=5000");
				} else if (relation.rightKey) { //1-n
					if(!ctrl.key){
						return null
					}
					str.push("filter_field=" + relation.rightKey);
					str.push("filter_value=" + ctrl.key);
					str.push("limit=" + ctrl.entities[relation.entity].query.limit)
				} else if (relation.intermediate && ctrl.entities[relation.entity].selected.length === 0) {
					if(!ctrl.key){
						return null
					}
					let intermediate = []
					intermediate.push("filter_field=" + relation.intermediate.leftKey);
					intermediate.push("filter_value=" + ctrl.key);
					str.push("limit=" + ctrl.entities[relation.entity].query.limit)
					if (ctrl.language) { intermediate.push("lang=" + ctrl.language) }
					let ety_intermediate = dmt.entities[relation.intermediate.entity];
					if (!ety_intermediate) {
						ety_intermediate = dmt.tables[relation.intermediate.entity];
					}
					$http.get(ety_intermediate.endpoint + "?" + intermediate.join("&")).then((response) => {
						response.data.data.forEach(function (item) {
							if (ctrl.entities[relation.entity].selected.indexOf(item[relation.intermediate.rightKey]) === -1) {
								ctrl.entities[relation.entity].selected.push(item[relation.intermediate.rightKey])
							}
						})
					})
				}else{
					str.push("limit=" + ctrl.entities[relation.entity].query.limit)
				}

				str.push("page=" + ctrl.entities[relation.entity].query.page)

				if (ctrl.language) { str.push("lang=" + ctrl.language) }
				$http.get(entity.endpoint + "?" + str.join("&")).then((response) => {
					ctrl.entities[relation.entity].table = table;
					ctrl.entities[relation.entity].data = response.data.data;
					ctrl.entities[relation.entity].total_results = response.data.total_results
					var booleans = [];
					var dates = [];
					for (let p in entity.fields) { //mysql boolean 1 / 0 to true / false            
						if (entity.fields[p].type === "boolean") {
							booleans.push(entity.fields[p].name)
						}
						if (entity.fields[p].type === "datetime") {
							dates.push(entity.fields[p].name)
						}
					}
					ctrl.entities[relation.entity].data.forEach(function (item) {
						for (let i in booleans) { //mysql boolean 1 / 0 to true / false            
							item[booleans[i]] = item[booleans[i]] === 1;
						}
						for (let i in dates) { //mysql boolean 1 / 0 to true / false            
							item[dates[i]] = new Date(item[dates[i]]);
						}
					});
					if (relation.type === '1-1') {
						ctrl.options[relation.leftKey] = ctrl.entities[relation.entity].data;
					}
					deferred.resolve()
				}, deferred.reject)
				return deferred.promise
			}
			ctrl.getData = function () {
				return ctrl.entities[ctrl.currentEntity.name].getData()
			}
			ctrl.downloadEntityData = function(relation){
				let str = [];
				let entity = dmt.entities[relation.entity];
				let table = null
				if (!entity) {
					entity = dmt.tables[relation.entity];
					table = entity
				} else {
					table = dmt.tables[entity.table]
				}
				if (ctrl.entities[relation.entity].query.filter.length) {
					str.push("filter=" + ctrl.entities[relation.entity].query.filter);
					table.fields.forEach((f) => {
						if (f.type === "string" || f.type === "text") {
							var name = f.name;
							if (f.prefix) {
								name = f.prefix + name
							}
							str.push("field=" + name);
						}
					})
				}
				for (let key in ctrl.entities[relation.entity].query.filters) {
					if (ctrl.entities[relation.entity].query.filters[key]) {
						ctrl.entities[relation.entity].query.filters[key].forEach((value) => {
							str.push("filter_field=" + key);
							str.push("filter_value=" + value);
						})
					}
				}
				var deferred = $q.defer()
				var request = new XMLHttpRequest();
				request.open("GET", entity.endpoint + "?download=true&" + str.join("&"));
				request.setRequestHeader("Authorization", localStorage.getItem("token"))
				request.responseType = "blob";
				request.onload = function () {
					if (request.status === 200) {
						deferred.resolve(request.response)
					} else {
						deferred.reject(request.response)
					}
				}
				request.send()
				return deferred.promise;
			}
			
			ctrl.download = function () {
				return ctrl.entities[ctrl.currentEntity.name].download()
			}
			ctrl.downloadUrl = function(url){
				var deferred = $q.defer()
				var request = new XMLHttpRequest();
				request.open("GET", url);
				request.setRequestHeader("Authorization", localStorage.getItem("token"))
				request.responseType = "blob";
				request.onload = function () {
					if (request.status === 200) {
						deferred.resolve(request.response)
					} else {
						deferred.reject(request.response)
					}
				}
				request.send()
				return deferred.promise;
			}
			return ctrl
		}
	})
