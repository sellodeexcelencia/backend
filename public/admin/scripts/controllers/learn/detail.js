angular.module('dmt-back').controller('learnDetailController',
	function ($scope, $mdDialog, $mdEditDialog, page, $http, entityService, $routeParams, $location) {
		let ctrl = this
		ctrl.entity = page.entity || page.parent.entity
		ctrl.filters = page.filters
		ctrl.service = entityService(ctrl.entity, ctrl.filters, $routeParams.id)
		ctrl.service.loadEntity('category')
		ctrl.page = page
		ctrl.currentEntity = ctrl.service.currentEntity
		ctrl.currentEntity.relations.forEach(ctrl.service.getEntityData)
		ctrl.entities = ctrl.service.entities
		ctrl.options = ctrl.service.options
		ctrl.loading = false
		if (ctrl.filters || $routeParams.id) {
			ctrl.service.getData().then(() => {
				ctrl.data = ctrl.entities[ctrl.entity].data[0]
				ctrl.service.entities.category.getData()
			})
		}
		ctrl.selectTab = function (tab) {
			ctrl.tab = tab
		}

		ctrl.delete = function (event, relation) {
			let entity = dmt.entities[relation.entity];
			$mdDialog.show({
				clickOutsideToClose: true,
				controller: entity.delete ? entity.delete.controller || 'deleteItemController' : 'deleteItemController',
				controllerAs: 'ctrl',
				focusOnOpen: false,
				targetEvent: event,
				locals: {
					entity: entity,
					items: ctrl.entities[relation.entity].selected,
				},
				templateUrl: entity.delete ? entity.delete.templateUrl || 'views/default/delete-dialog.html' : 'views/default/delete-dialog.html',
			}).then(ctrl.getData);
		}
		ctrl.create = function (event, relation) {
			let entity = dmt.entities[relation.entity];
			$mdDialog.show({
				clickOutsideToClose: true,
				controller: entity.add ? entity.add.controller || 'addItemController' : 'addItemController',
				controllerAs: 'ctrl',
				focusOnOpen: false,
				targetEvent: event,
				templateUrl: entity.add ? entity.add.template || 'views/default/add-dialog.html' : 'views/default/add-dialog.html',
				locals: {
					entity: relation.entity || relation.table,
					lang: ctrl.language,
					relation: relation,
					parent: {
						data: ctrl.data,
						entity: ctrl.currentEntity
					}
				},
			}).then(ctrl.getData);
		};
		function getYouTubeId(url) {
			var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
			var match = url.match(regExp);
			if (match && match[2].length == 11) {
				return match[2];
			} else {
				return 'error';
			}
		}
		ctrl.saveItem = function ($event) {
			ctrl.loading = true
			var id = getYouTubeId(ctrl.data.url);
			if (id != 'error') {
				ctrl.data.url = 'https://www.youtube.com/embed/' + id
			}
			ctrl.service.save(ctrl.data, $event).then(() => {
				ctrl.loading = false
				$mdDialog.show($mdDialog.alert()
					.parent(angular.element(document.body))
					.clickOutsideToClose(true)
					.title('Guardado')
					.textContent('Se ha guardado exitosamente')
					.ariaLabel('Guardado exitosamente')
					.ok('Aceptar')
					.targetEvent($event))
					.then(() => {
						var url = []
						var parent = ctrl.page.parent
						do {
							url.push(parent.path)
							parent = parent.parent
						} while (parent)
						url.reverse()
						$location.path('/' + url.join('/'))
					})
			})
		}
		return ctrl
	});
