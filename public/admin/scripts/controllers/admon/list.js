angular.module('dmt-back').controller('admonListController',
	function ($scope, $mdDialog,
		$mdEditDialog,
		page, $http,
		entityService, $routeParams, Excel,
		$timeout, $window, $location,$scope) {
		let ctrl = {}
		ctrl.entity = page.entity || page.parent.entity
		ctrl.page = page
		ctrl.filters = page.filters
		ctrl.service = entityService(ctrl.entity, ctrl.filters, $routeParams.id)
		ctrl.service.loadEntity('institution')
		ctrl.parent = parent
		ctrl.currentEntity = ctrl.service.currentEntity
		ctrl.currentEntity.relations.forEach(ctrl.service.getEntityData)
		ctrl.entities = ctrl.service.entities
		ctrl.options = ctrl.service.options
		ctrl.data = null
		ctrl.query = null
		ctrl.promise = null
		ctrl.institution = null
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
		$scope.$watch('ctrl.institution',(_new,_old,_scope)=>{
			if(_new){
				ctrl.entities[ctrl.entity].query.filters['institutions.id'] = [_new.id]
				ctrl.update()
			}else{
				delete ctrl.entities[ctrl.entity].query.filters['institutions.id']
				ctrl.update()
			}
		})
		
		return ctrl
	});
