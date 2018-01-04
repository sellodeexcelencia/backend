angular.module('dmt-back').controller('citizenDetailController', 
function ($scope, $mdDialog, $mdEditDialog, page, $http, entityService, $routeParams,$location) {
	let ctrl = this
	ctrl.entity = page.entity || page.parent.entity
	ctrl.filters = page.filters
	ctrl.service = entityService(ctrl.entity,ctrl.filters,$routeParams.id)
	ctrl.service.loadEntity('service_comment')
	ctrl.service.entities.service_comment.query.filters.id_user = [$routeParams.id]
	ctrl.service.entities.service_comment.getData()
	ctrl.page = page
	ctrl.currentEntity = ctrl.service.currentEntity
	ctrl.entities = ctrl.service.entities
	ctrl.options = ctrl.service.options
	ctrl.loading = false
	if(ctrl.filters || $routeParams.id){
		ctrl.service.getData().then(()=>{
			ctrl.data = ctrl.entities[ctrl.entity].data[0]
			ctrl.service.entities.city.data.push(ctrl.data.city)
			ctrl.service.entities.country.data.push(ctrl.data.country)
			ctrl.service.entities.region.data.push(ctrl.data.region)
		})
	}
	ctrl.selectCountry = function(){
		ctrl.service.entities.region.filters.id_country = [ctrl.data.id_country]
		ctrl.service.entities.region.getData()
	}
	ctrl.selectRegion = function (){
		ctrl.service.entities.city.filters.id_region = [ctrl.data.id_region]
		ctrl.service.entities.city.getData()
	}
	ctrl.selectTab = function (tab) {
		ctrl.tab = tab
	}

	ctrl.sendMessage = function(event){
		$mdDialog.show({
			clickOutsideToClose: true,
			controller: 'sendMessageController',
			controllerAs: 'ctrl',
			focusOnOpen: false,
			targetEvent: event,
			locals: {
				user: ctrl.data,
				entity: false,
			},
			templateUrl: 'views/admon/message-dialog.html',
		})
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
		}).then(ctrl.update);
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
		}).then(ctrl.update);
	};
	ctrl.saveItem = function($event){
		ctrl.loading = true
		ctrl.service.save(ctrl.data,$event).then(()=>{
			ctrl.loading = false
			$mdDialog.show($mdDialog.alert()
			.parent(angular.element(document.body))
			.clickOutsideToClose(true)
			.title('Guardado')
			.textContent('Se ha guardado exitosamente')
			.ariaLabel('Guardado exitosamente')
			.ok('Aceptar')
			.targetEvent($event))
			.then(()=>{
				var url = []
				var parent = ctrl.page.parent
				do{
					url.push(parent.path)
					parent = parent.parent
				}while(parent)
				url.reverse()
				$location.path('/'+url.join('/'))
			})	
		})
	}
	ctrl.updateComments = function(){
		ctrl.service.entities.service_comment.getData()
	}
	ctrl.downloadComments = function () {
		ctrl.entities.service_comment.download().then((response) => {
			var filename =  'Comentarios.xlsx'
			saveAs(response, filename)
		})
	}
	return ctrl
});
