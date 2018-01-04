angular.module('dmt-back').controller('rolesListController',
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
			if(item.id <= 4){
				return
			}
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
		ctrl.noDelete = function () {
			$mdDialog.show($mdDialog.alert()
				.parent(angular.element(document.body))
				.clickOutsideToClose(true)
				.title('No se puede borrar')
				.textContent('No se puede eliminar ningún perfil ya que esto puede afectar la funcionalidad de la plataforma')
				.ariaLabel('No Borrar')
				.ok('OK')				
			)
		}
		ctrl.noDelete()
		return ctrl
	});
