angular.module('dmt-back').controller('servicesDetailController', 
function ($scope, $mdDialog, $mdEditDialog, page, $http, entityService, $routeParams, $location,STATES) {
	let ctrl = this
	ctrl.entity = page.entity || page.parent.entity
	ctrl.filters = page.filters
	ctrl.service = entityService(ctrl.entity,ctrl.filters,$routeParams.id)
	ctrl.service.loadEntity('motivename')
	ctrl.service.loadEntity('usertype')
	ctrl.service.loadEntity('request_status')
	ctrl.service.entities.service_status.query.order = 'id asc'
	ctrl.page = page
	ctrl.currentEntity = ctrl.service.currentEntity
	ctrl.today = new Date()
	ctrl.STATES = STATES
	ctrl.selectedInstitution = function(institution){
		if(institution){
			ctrl.data.id_institution = institution.id
		}
	}
	ctrl.currentEntity.relations.forEach((relation)=>{
		if(relation.entity == 'points'){
			ctrl.points_relation = relation
		}
		if(relation.entity == 'questiontopic'){
			ctrl.questiontopic_relation = relation
		}
		if(relation.entity == 'user_answer'){
			ctrl.user_answer_relation = relation
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
			ctrl.service.entities.institution.data.push(ctrl.data.region)
		})
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
		var data = JSON.parse(JSON.stringify(ctrl.data))
		delete data.current_status
		ctrl.service.save(data,$event).then(()=>{
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
	ctrl.updateItem = function(item,f,relation){
		ctrl.service.updateItem(item,f,relation)
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
	ctrl.downloadPoints = function () {
		ctrl.entities.points.download().then((response) => {
			var filename = 'Puntos.xlsx'
			saveAs(response, filename)
		})
	}

	ctrl.openAnswerDetail = function(answer){
		$mdDialog.show({
			clickOutsideToClose: true,
			controller: 'answerController',
			controllerAs: 'ctrl',
			focusOnOpen: false,
			targetEvent: null,
			templateUrl: 'views/answer/detail.html',
			locals: {
				answer:answer,
				parent: {
					data: ctrl.data,
					entity: ctrl.currentEntity
				}
			},
		}).then(()=>{
			ctrl.service.entities.user_answer.getData()
		},()=>{
			ctrl.service.entities.user_answer.getData()
		});
	}
	return ctrl
});
