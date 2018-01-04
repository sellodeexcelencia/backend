angular.module('dmt-back').controller('answerController', 
function ($scope, $mdDialog, $mdEditDialog, parent, $http, entityService, $routeParams, answer, STATES) {
	let ctrl = this
	ctrl.entity = 'user_answer';
	ctrl.STATES = STATES
	ctrl.service = entityService(ctrl.entity,ctrl.filters,answer.id)
	ctrl.currentEntity = ctrl.service.currentEntity
	ctrl.today = new Date()
	ctrl.currentEntity.relations.forEach(ctrl.service.getEntityData)
	ctrl.entities = ctrl.service.entities
	ctrl.options = ctrl.service.options
	ctrl.loading = false
	ctrl.data = answer
	ctrl.cancel = function() {
		$mdDialog.cancel()
	}
	ctrl.reasignate = function(request){
		request.showAutocomplete = true
		request.user = null
		request.id_user = null

	}
	ctrl.approve = function(request){
		request.id_request_status = ctrl.STATES.EVALUATION_REQUEST.CUMPLE
		ctrl.saveRequest(request)
	}
	ctrl.reject = function(request){
		request.id_request_status = ctrl.STATES.EVALUATION_REQUEST.NO_CUMPLE
		ctrl.saveRequest(request)
	}
	ctrl.evaluatorSelected = function(request){
		request.showAutocomplete = false
		request.id_user = request.user.id
		request.id_request_status = ctrl.STATES.EVALUATION_REQUEST.ASIGNADO
		ctrl.saveRequest(request)
	}
	ctrl.selectTab = function (tab) {
		ctrl.tab = tab
	}
	ctrl.saveRequest = function(request){
		request.loading = true
		ctrl.service.updateItem(request, null, {entity:'evaluation_request'}).then(()=>{
			request.loading = false
		})
	}
	$scope.$watch('ctrl.entities.evaluation_request.data',(_val,_old,scope)=>{
		if(_val && _val.length){
			ctrl.getMessages()
		}
	})
	ctrl.getMessages = function(){
		ctrl.entities.evaluation_request.data.forEach((request)=>{
			var url = '/api/question/chats?filter_field=id_evaluation_request&filter_value=' + request.id
			$http.get(url).then((response)=>{
				request.messages = response.data.data
			})
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
				var parent = ctrl.parent
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
		}).then(ctrl.getData);
	}
	return ctrl
});
