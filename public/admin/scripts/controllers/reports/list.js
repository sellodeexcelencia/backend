angular.module('dmt-back').controller('reportsController', 
function ($scope, $mdDialog, page, entityService, $http) {
	let ctrl = {}
	ctrl.service = entityService('')
	ctrl.service.loadEntity('hall_of_fame')
	ctrl.date_hall = new Date()
	
	ctrl.downloadHall = function(){
		ctrl.service.entities.hall_of_fame.query.filters = {
			date:['>= '+ctrl.date_hall.toISOString().split('T')[0],'<= '+ctrl.date_hall.toISOString().split('T')[0]]
		}
		ctrl.service.entities.hall_of_fame.download().then((response)=>{
			var filename = 'Salón de la Fama.xlsx'
			saveAs(response, filename)
		})
	}

	ctrl.service.loadEntity('service')
	ctrl.downloadServiceReport = function(){
		ctrl.service.downloadUrl('/api/stats/service?limit=5000&download=true&service='+ctrl._service.id).then((response)=>{
			var filename = 'Servicio.xlsx'
			saveAs(response, filename)
		})
	}

	ctrl.downloadPerformance = function(){
		let url = ''
		if(ctrl._filter === 2){
			url = '/api/stats/performance?limit=5000&download=true&institution='+ctrl._institution.id
		}else{
			url = '/api/stats/performance?limit=5000&download=true'
		}
		ctrl.service.downloadUrl(url).then((response)=>{
			var filename = 'Institucion.xlsx'
			saveAs(response, filename)
		})
	}

	ctrl.downloadCertified = function(){
		let url = '/api/stats/certified?limit=5000&download=true'
		ctrl.service.downloadUrl(url).then((response)=>{
			var filename = 'Otorgados.xlsx'
			saveAs(response, filename)
		})
	}

	ctrl.downloadEverCertified = function(){
		let url = '/api/stats/certified?limit=5000&download=true&older=true'
		ctrl.service.downloadUrl(url).then((response)=>{
			var filename = 'Otorgados.xlsx'
			saveAs(response, filename)
		})
	}

	ctrl.downloadDenied = function(){
		let url = '/api/stats/denied?limit=5000&download=true'
		ctrl.service.downloadUrl(url).then((response)=>{
			var filename = 'NoOtorgados.xlsx'
			saveAs(response, filename)
		})
	}

	ctrl.service.loadEntity('institution')
	return ctrl
});
