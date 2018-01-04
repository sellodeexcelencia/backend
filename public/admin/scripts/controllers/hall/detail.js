angular.module('dmt-back').controller('hallFameController', 
function ($scope, $mdDialog, $mdEditDialog, page, $http, entityService, $routeParams, Excel,$timeout,$window) {
	let ctrl = {}
	ctrl.entity = page.entity || page.parent.entity
	ctrl.page = page
	ctrl.filters = page.filters
	ctrl.service = entityService(ctrl.entity,ctrl.filters,$routeParams.id)
	ctrl.parent = parent
	ctrl.currentEntity = ctrl.service.currentEntity
	ctrl.currentEntity.relations.forEach(ctrl.service.getEntityData)
	ctrl.entities = ctrl.service.entities
	ctrl.options = ctrl.service.options
	ctrl.entities[ctrl.entity].query.filters.id_role = []
	ctrl.data = null
	ctrl.query = null
	ctrl.promise = null
	ctrl.updateDates = function(){
		ctrl.entities[ctrl.entity].query.filters.date = []
		if(ctrl.date_from){
			ctrl.entities[ctrl.entity].query.filters.date.push('>= '+ctrl.date_from.toISOString().split('T')[0])
		}
		if(ctrl.date_to){
			ctrl.entities[ctrl.entity].query.filters.date.push('<= '+ctrl.date_to.toISOString().split('T')[0])
		}
		ctrl.update()
	}
	ctrl.download = function(){
		ctrl.service.download().then((response)=>{
			var filename = ctrl.page.name+'.xlsx'
			saveAs(response, filename)
		})
	}
	ctrl.update = function(){
		ctrl.promise = ctrl.service.getData()
		ctrl.promise.then(()=>{
			ctrl.data = ctrl.entities[ctrl.entity].data
			ctrl.data.forEach((item)=>{
				let offset = item.date.getTimezoneOffset()*60000
				item.date.setTime(item.date.getTime()+offset)
			})
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
	
	return ctrl
});
