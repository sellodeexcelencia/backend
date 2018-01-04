angular.module('dmt-back').controller('questionListController',
	function ($scope, $mdDialog,
		$mdEditDialog,
		page, $http,
		entityService, $routeParams, Excel,
		$timeout, $window, $location) {
		let ctrl = {}
		ctrl.entity = page.entity || page.parent.entity
		ctrl.page = page
		ctrl.filters = page.filters
		ctrl.service = entityService(ctrl.entity, ctrl.filters, $routeParams.id)
		ctrl.parent = parent
		ctrl.currentEntity = ctrl.service.currentEntity
		ctrl.currentEntity.relations.forEach(ctrl.service.getEntityData)
		ctrl.entities = ctrl.service.entities
		ctrl.options = ctrl.service.options
		ctrl.data = null
		ctrl.query = null
		ctrl.promise = null

		ctrl.create = function () {
			var path = $location.path()
			path += "/add/"
			$location.path(path)
		}
		ctrl.details = function (item) {
			var path = $location.path()
			var id = item.id
			ctrl.currentEntity.fields.forEach((f) => {
				if (f.key) {
					id = item[f.name]
				}
			})
			path += "/detail/" + id
			$location.path(path)
		}
		ctrl.download = function () {
			ctrl.service.download().then((response) => {
				var filename = ctrl.page.name + '.xlsx'
				saveAs(response, filename)
			})
		}
		ctrl.update = function () {
			ctrl.promise = ctrl.service.getData()
			ctrl.promise.then(() => {
				ctrl.data = ctrl.entities[ctrl.entity].data
			})
		}
		ctrl.removeFilter = function () {
			$scope.filter.show = false;
			ctrl.entities[ctrl.entity].query.filter = '';

			if ($scope.filter.form.$dirty) {
				$scope.filter.form.$setPristine();
			}
			ctrl.update()
		};
		ctrl.update()
		ctrl.delete = function (event) {
			$mdDialog.show({
				clickOutsideToClose: true,
				controller: ctrl.entity.delete ? ctrl.entity.delete.controller || 'deleteItemController' : 'deleteItemController',
				controllerAs: 'ctrl',
				focusOnOpen: false,
				targetEvent: event,
				locals: {
					entity: ctrl.currentEntity,
					items: ctrl.entities[ctrl.entity].selected
				},
				templateUrl: ctrl.entity.delete ? ctrl.entity.delete.templateUrl || 'views/default/delete-dialog.html' : 'views/default/delete-dialog.html',
			}).then(ctrl.update);
		}



		ctrl.entities[ctrl.entity].filters = [
			{
				name: "Categoría",
				endpoint: "/api/service/category",
				fields: [{
					entity: "questiontopic",
					name: "id_topic",
					foreign_key: "id_category",
				}],
				filter_key: "id",
				filter_name: "name"
			}
		]
		ctrl.updateFilter = function (filter) {
			if (filter.filter) { //affects another filter
				ctrl.entities[ctrl.entity].filters.forEach((item) => {
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
				if (filter.selected === "null") { //cleaning the filter
					filter.fields.forEach((field) => { //iterate trough the values
						ctrl.entities[ctrl.entity].query.filters[field.name] = [];
					})
					ctrl.update()
				} else {
					filter.fields.forEach((field) => { //iterate trough the values
						ctrl.entities[ctrl.entity].query.filters[field.name] = [];
						ctrl.options[field.name].forEach((option) => {
							if (option[field.foreign_key] == filter.selected) { //AND relation
								ctrl.entities[ctrl.entity].query.filters[field.name].push(option[filter.filter_key]);
							}
						})
					})
					ctrl.update();
				}
			}
		}

		function addFilters(item, index) {
			var base = item.endpoint;
			if (!base) {
				base = ctrl.entity.endpoint;
			}
			$http.get(base).then(function (results) {
				item.options = results.data.data;
			});
		}
		if (ctrl.entities[ctrl.entity].filters) {
			ctrl.entities[ctrl.entity].filters.forEach(addFilters);
		}
		return ctrl
	});
