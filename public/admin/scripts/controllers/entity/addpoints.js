angular.module('dmt-back').controller('addEntityPointsController', function ($mdDialog, entity, lang, relation, parent, $http) {
	var ctrl = this;
	ctrl.data = {
		id_motives:5,
		id_institution: parent.id
	};
	ctrl.options = {};
	ctrl.filters = {};
	ctrl.currentEntity = dmt.entities[entity];
	ctrl.relation = relation;
	ctrl.parent = parent;
	ctrl.language = lang;
	if (ctrl.relation) {
		if (ctrl.relation.rightKey) {
			ctrl.data[ctrl.relation.rightKey] = ctrl.parent.data[ctrl.parent.entity.defaultSort]
		}
	}

	function updateFilter(filter) {
		if (filter.filter) { //affects another filter
			ctrl.currentEntity.filters.forEach((item) => {
				if (item.name === filter.filter) { //find the associated filter
					if (filter.selected === "null") { //cleaning the filter
						item.options = item.fulloptions || item.options;
						delete item.fulloptions;
					} else {
						if (!item.fulloptions) {
							item.fulloptions = item.options; // store the options
						}
						item.options = item.fulloptions.filter((option) => { //filter the options
							let match = true;
							filter.fields.forEach((field) => { //iterate trough the values
								if (option[field] != filter.selected) { //AND relation
									match = false;
								}
							})
							return match;
						});
					}
				}
			});
		} else { //direct fields
			var filters = {};
			function updateOptions(field){
				var url = dmt.entities[field.entity].endpoint
				if (filter.selected !== "null") {
					url += '?filter_field=' + field.foreign_key + '&filter_value=' + filter.selected;
				}
				$http.get(url).then(function (results) {
					ctrl.options[field.name] = results.data;
				})	
			}
			filter.fields.forEach(updateOptions);
			/*filter.fields.forEach((field) => { //iterate trough the values
				var url = dmt.entities[field.entity].endpoint
				if (filter.selected !== "null") {
					url += '?filter_field=' + field.foreign_key + '&filter_value=' + filter.selected;
				}
				$http.get(url).then(function (results) {
					ctrl.options[item.name] = results.data;
				})
			})*/

		}
	}
	ctrl.updateFilter = updateFilter;
	function addFilters(item, index) {
		var base = item.endpoint;
		if (!base) {
			base = ctrl.currentEntity.endpoint;
		}
		$http.get(base).then(function (results) {
			item.options = results.data;
		});
	}

	function addOptions(item, index) {
		var base = item.endpoint;
		if (!base) {
			let entity = dmt.entities[item.table];
			let table = null
			if (!entity) {
				entity = dmt.tables[item.table];
			} 
			base = entity.endpoint
		}
		if (!base) {
			base = ctrl.currentEntity.endpoint;
		}
		$http.get(base+'?limit=5000').then(function (results) {
			if(item.name === 'id_motives'){
				results.data.data.forEach((motive)=>{
					if(motive.name.name === 'Eventos Especiales'){
						ctrl.options[item.name] = {data : [motive]}
					}
				})
			}else{
				ctrl.options[item.name] = results.data;
			}
			
		});
	}
	var opts = [];
	for (var i in this.currentEntity.fields) {
		var f = this.currentEntity.fields[i];
		if (f.type === 'link') {
			opts.push(f);
		}
	}
	opts.forEach(addOptions);
	if (ctrl.currentEntity.filters) {
		ctrl.currentEntity.filters.forEach(addFilters);
	}

	this.cancel = $mdDialog.cancel;

	function error(err) {
		window.location.href = "/admin/login";
	}
	function success() {
		$mdDialog.hide();
	}
	this.addItem = function () {
		ctrl.form.$setSubmitted();
		if (ctrl.form.$valid) {
			var base = ctrl.currentEntity.endpoint;
			if (ctrl.data.timestamp) {
				delete ctrl.data.timestamp;
			}
			if (ctrl.currentEntity.translate) {
				ctrl.data.language = ctrl.language
			}
			/*var fd = new FormData();
			for(let i in ctrl.data){
				fd.append(i,ctrl.data[i]);
			}*/

			$http.post(base, ctrl.data).then(success).catch(error);
		}
	};
});
