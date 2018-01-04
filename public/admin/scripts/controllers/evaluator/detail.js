angular.module('dmt-back').controller('evaluatorDetailController', 
function ($scope, $mdDialog, $mdEditDialog, page, $http, entityService, $routeParams, $location) {
	let ctrl = this
	ctrl.entity = page.entity || page.parent.entity
	ctrl.filters = page.filters
	ctrl.service = entityService(ctrl.entity,ctrl.filters,$routeParams.id)
	ctrl.service.loadEntity('motivename')
	ctrl.service.loadEntity('usertype')
	ctrl.service.loadEntity('request_status')
	ctrl.page = page
	ctrl.currentEntity = ctrl.service.currentEntity
	ctrl.today = new Date()
	ctrl.currentEntity.relations.forEach((relation)=>{
		if(relation.entity == 'points'){
			ctrl.points_relation = relation
		}
		if(relation.entity == 'questiontopic'){
			ctrl.questiontopic_relation = relation
		}
		ctrl.service.getEntityData(relation)
	})
	ctrl.entities = ctrl.service.entities
	ctrl.options = ctrl.service.options
	ctrl.loading = false
	if(ctrl.filters || $routeParams.id){
		ctrl.service.getData().then(()=>{
			ctrl.data = ctrl.entities[ctrl.entity].data[0]
			ctrl.service.entities.motivename.getData()
			ctrl.service.entities.usertype.getData()
			ctrl.service.entities.request_status.getData()
			if(!ctrl.data.region.id){
				ctrl.data.region = null
			}else{
				ctrl._region = ctrl.data.region.id
			}
			if(!ctrl.data.country.id){
				ctrl.data.country = null
			}else{
				ctrl._country = ctrl.data.country.id
			}
			if(!ctrl.data.city.id){
				ctrl.data.city = null
			}			
		})
	}
	ctrl.selectedCountry = function(country){
		if(country && country.id){
			if(country.id !== ctrl._country){
				ctrl._country = -1
				ctrl.data.region = null
				ctrl.data.id_region = null
				ctrl.data.city = null
				ctrl.data.id_city = null
			}
			ctrl.data.id_country = country.id
			ctrl.service.entities.region.query.filters.id_country = [country.id]
		}else{
			ctrl.data.country = null
			ctrl.data.region = null
			ctrl.data.id_region = null
			ctrl.data.city = null
			ctrl.data.id_city = null
		}
	}
	ctrl.selectedRegion = function (region){
		if(region){
			if(region.id !== ctrl._region){
				ctrl._region = -1
				ctrl.data.city = null
				ctrl.data.id_city = null
			}
			ctrl.data.id_region = region.id
			ctrl.service.entities.city.query.filters.id_region = [region.id]
		}else{
			ctrl.data.city = null
			ctrl.data.id_city = null
		}
	}
	ctrl.selectedCity = function(city){
		if(city){
			ctrl.data.id_city = city.id
		}
	}
	ctrl.selectTab = function (tab) {
		ctrl.tab = tab
	}
	ctrl.removeRepresentant = function($event){
		var url = '/api/configuration/institution_user?id_institution=' + $routeParams.id
		$http.delete(url).then(()=>{
			$mdDialog.show($mdDialog.alert()
			.parent(angular.element(document.body))
			.clickOutsideToClose(true)
			.title('Guardado')
			.textContent('Se ha eliminado el representante de esta entidad.')
			.ariaLabel('Guardado exitosamente')
			.ok('Aceptar')
			.targetEvent($event))
		})
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
	ctrl.selectQt = function(selection){
		ctrl.service.bind(selection,ctrl.questiontopic_relation)
	}
	ctrl.unselectQt = function(selection){
		ctrl.service.unbind(selection,ctrl.questiontopic_relation)
	}
	ctrl.serviceDetail = function(item){
		$location.path('postulaciones/todos/detalle/'+item.id)
	}
	ctrl.createPoints = function(event){
		$mdDialog.show({
			clickOutsideToClose: true,
			controller: 'addEntityPointsController',
			controllerAs: 'ctrl',
			focusOnOpen: false,
			targetEvent: event,
			templateUrl: 'views/entity/add-points.html',
			locals: {
				entity: ctrl.points_relation.entity,
				lang: ctrl.language,
				relation: ctrl.points_relation,
				parent: {
					data: ctrl.data,
					entity: ctrl.currentEntity
				}
			},
		}).then(ctrl.entities.points.getData);
	}
	ctrl.downloadServices = function () {
		ctrl.entities.service.download().then((response) => {
			var filename =  'Servicios.xlsx'
			saveAs(response, filename)
		})
	}
	ctrl.downloadPoints = function () {
		ctrl.entities.points.query.filters.id_user = [$routeParams.id]
		ctrl.entities.points.download().then((response) => {
			var filename = 'Puntos.xlsx'
			saveAs(response, filename)
		})
	}
	return ctrl
});
