angular.module('dmt-back').controller('detailItemRegionController', 
function ($scope, $mdDialog, $mdEditDialog, page, $http, entityService, $routeParams, $location) {
	let ctrl = this
	ctrl.entity = page.entity || page.parent.entity
	ctrl.filters = page.filters
	ctrl.service = entityService(ctrl.entity,ctrl.filters,$routeParams.id)
	ctrl.page = page
	ctrl.currentEntity = ctrl.service.currentEntity
	ctrl.currentEntity.relations.forEach((relation)=>{
		if(relation.entity == 'points'){
			ctrl.points_relation = relation
		}
		ctrl.service.getEntityData(relation)
	})
	ctrl.entities = ctrl.service.entities
	ctrl.options = ctrl.service.options
	ctrl.loading = false
	ctrl.country = null
	if(ctrl.filters || $routeParams.id){
		ctrl.service.getData().then(()=>{
			ctrl.data = ctrl.entities[ctrl.entity].data[0]
			if(!ctrl.data.country.id){
				ctrl.data.country = null
			}else{
				ctrl._country = ctrl.data.country.id
			}
			if(!ctrl.data.capital.id){
				ctrl.data.capital = null
			}
		})
	}
	ctrl.selectedCountry = function(country){
		if(country){
			if(country.id !== ctrl._country){
				ctrl._country = -1
				ctrl.data.region = null
				ctrl.data.id_region = null
				ctrl.data.capital = null
				ctrl.data.id_capital = null
			}
			ctrl.data.id_country = country.id
			ctrl.service.entities.region.query.filters.id_country = [country.id]
		}else{
			ctrl.data.region = null
			ctrl.data.id_region = null
			ctrl.data.city = null
			ctrl.data.id_capital = null
		}
	}
	ctrl.selectedRegion = function (region){
		if(region){
			if(region.id !== ctrl._region){
				ctrl._region = -1
				ctrl.data.city = null
				ctrl.data.id_capital = null
			}
			ctrl.data.id_region = region.id
			ctrl.service.entities.city.query.filters.id_region = [region.id]
		}else{
			ctrl.data.capital = null
			ctrl.data.id_capital = null
		}
	}
	ctrl.selectedCity = function(city){
		if(city){
			ctrl.data.id_capital = city.id
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
				entity: true,
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

	ctrl.updateServices = function(){
		ctrl.service.entities.service.getData()
	}
	ctrl.serviceDetail = function(item){
		$location.path('postulaciones/todos/detail/'+item.id)
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
		ctrl.entities.points.download().then((response) => {
			var filename = 'Puntos.xlsx'
			saveAs(response, filename)
		})
	}
	return ctrl
});
