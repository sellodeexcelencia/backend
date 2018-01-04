angular.module('dmt-back').controller('detailItemController', 
function ($scope, $mdDialog, $mdEditDialog, page, $http, entityService, $routeParams) {
	this.entity = page.entity || page.parent.entity
	this.filters = page.filters
	this.service = entityService(this.entity,this.filters,$routeParams.id)
	this.page = page
	this.currentEntity = this.service.currentEntity
	this.currentEntity.relations.forEach(this.service.getEntityData)
	this.entities = this.service.entities
	this.options = this.service.options
	this.loading = false
	if(this.filters || $routeParams.id){
		this.service.getData().then(()=>{
			this.data = this.entities[this.entity].data[0]
		})
	}
	
	this.selectTab = function (tab) {
		this.tab = tab
	}

	this.delete = function (event, relation) {
		let entity = dmt.entities[relation.entity];
		$mdDialog.show({
			clickOutsideToClose: true,
			controller: entity.delete ? entity.delete.controller || 'deleteItemController' : 'deleteItemController',
			controllerAs: 'ctrl',
			focusOnOpen: false,
			targetEvent: event,
			locals: {
				entity: entity,
				items: this.entities[relation.entity].selected,
			},
			templateUrl: entity.delete ? entity.delete.templateUrl || 'views/default/delete-dialog.html' : 'views/default/delete-dialog.html',
		}).then(this.update);
	}
	this.create = function (event, relation) {
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
		}).then(this.update);
	};
	this.saveItem = function($event){
		this.loading = true
		this.service.save(this.data,$event).then(()=>{
			this.loading = false
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
				var parent = this.page.parent
				do{
					url.push(parent.path)
					parent = parent.parent
				}while(parent)
				url.reverse()
				$location.path('/'+url.join('/'))
			})	
		})
	}

	return this
});
