/*
*
*   ARRRRRRRRRRRRRRRRRRRRRR!
*
*
*              |    |    |
*             )_)  )_)  )_)
*            )___))___))___)
*           )____)____)_____)\
*         _____|____|____|____\\\__
*---------\                   /---------
*  ^^^^^ ^^^^^^^^^^^^^^^^^^^^^
*    ^^^^      ^^^^     ^^^    ^^
*         ^^^^      ^^^
*
*
*/
if (!localStorage.getItem("token")) {
	window.location.href = "/admin/login";
}else{
	var last = localStorage.getItem("last_access")
	if(!last){
		localStorage.setItem("last_access",new Date())
	}else{
		last = new Date(last)
		var now = new Date()
		if(now - last > 24*60*60*1000){
			localStorage.removeItem("token");
			window.location.href = "/admin/login";
		}
		localStorage.setItem("last_access",new Date())
	}
}
var app = angular.module('dmt-back', [
'ngRoute', 
'ngMaterial', 
'ngSanitize', 
'md.data.table',
'textAngular',
'ngFileUpload']);
/**
 * Configuration of the application from config.js
 */
app.config(function ($mdThemingProvider, $routeProvider, $locationProvider, $provide) {
	let primary = $mdThemingProvider
	.extendPalette('pink',{
		'400':'a42a5b',
		'900':'b34f75'
	})
	let accent = $mdThemingProvider
	.extendPalette('cyan',{
		'400':'00c8d1'
	})
	$mdThemingProvider.definePalette('stampBrown', primary)
	$mdThemingProvider.theme('default')
	.primaryPalette('blue',{
		'default':'400',
		'hue-1':'900',
	})
	.accentPalette('cyan',{
		'default':'400'
	})
	.backgroundPalette('grey')
	var token = localStorage.getItem("token").split('.')[1]
	const base64 = token.replace('-', '+').replace('_', '/')
	var user =  JSON.parse(decodeBase64(base64))
	for (var name in dmt.entities) {
		let entity = dmt.entities[name]
		dmt.api.endpoints.forEach(function (endpoint) {
			endpoint.entities.forEach(function (ety) {
				if (ety.entity == name) {
					dmt.entities[name].name = name
					dmt.entities[name].endpoint = '/api/' + endpoint.controller + '/' + ety.entity
				}
			})
		})
		entity.relations = entity.relations || []
		entity.relations.forEach((relation) => {
			if (relation.leftKey) {
				let table = dmt.tables[entity.table]
				table.fields.forEach((f) => {
					if (f.name == relation.leftKey) {
						let foreign_entity = dmt.entities[relation.entity]
						let foreign_table = null
						if (foreign_entity) {
							foreign_table = dmt.tables[foreign_entity.table]
							f.table = foreign_entity.table
							f.endpoint = foreign_entity.endpoint
						} else {
							foreign_table = dmt.tables[relation.entity]
							f.table = relation.entity
						}
						f.type = "link"
						f.foreign_key = foreign_table.defaultSort
						f.foreign_name = relation.foreign_name
					}
				})
			}
		})
		entity.fields = dmt.tables[entity.table].fields
		if (entity.translate) {
			let translatefields = dmt.tables[entity.translate.table].fields
			translatefields.forEach((f) => {
				if (f.name == entity.translate.rightKey || f.name === "id_lang") {
					return
				}
				f.prefix = entity.translate.table+'_'
				entity.fields.push(f);
			})
		}
		entity.defaultSort = dmt.tables[entity.table].defaultSort
	}

	for(var name in dmt.tables){
		if(dmt.entities[name]){
			continue;
		}
		entity = dmt.entities[name] = {
			name: name,
			table: name,
			fields: dmt.tables[name].fields,
			defaultSort: dmt.tables[name].defaultSort
		}
		//endpoint: '/api/' + section.path + '/',
		dmt.api.endpoints.forEach(function (endpoint) {
			endpoint.entities.forEach(function (ety) {
				if (ety.entity == name) {
					entity.endpoint = '/api/' + endpoint.controller + '/' + ety.entity
				}
			})
		})
	}
	
	function addPage(path, page, parent) {
		page.parent = parent;
		var route = {
			controller: page.controller || "listItemController",
			controllerAs: page.controllerAs || "ctrl",
			templateUrl: page.templateUrl || "views/default/list.html",
			resolve: {
				page: function () { return page; }
			}
		};
		var _path = path + "/" + page.path;
		$routeProvider.when(_path, route);
		if (page.pages) {
			page.pages.forEach((child) => {
				addPage(_path, child, page);
			})
		}
	}

	/**
	 * Parse Config File to create the navigation tree
	 */
	
	dmt.config.forEach((section) => {
		section.pages.forEach((page) => {
			//check permission and 
			if(user.permissions.indexOf(page.permission) == -1){
				page.authorized = false
				return
			}
			page.authorized = true
			addPage("/" + section.path, page, section);
		});
	});
	$routeProvider.when('/',{
                        templateUrl: "views/home.html",
                }
	)
	$routeProvider.otherwise({
		redirectTo: '/'
	});
	//$locationProvider.html5Mode(true);
	$provide.decorator('taOptions', ['$delegate', function(taOptions){
		taOptions.forceTextAngularSanitize = true;
		taOptions.toolbar = [
      ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
      ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
      ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
      ['html', 'insertImage','insertLink']
		]
		return taOptions
	}]);
});
app.constant("STATES",{
  SERVICE: {
		'INCOMPLETO': 1, //EN DILIGENCIAMIENTO POR LA ENTIDAD
		'VERIFICACION': 2,  //EN VERIFICACIÓN POR EL ADMON
		'EVALUACION': 3, //EN PROCESO DE EVALUACIÓN
		'CUMPLE': 4, // CUMPLE
		'NO_CUMPLE': 5 // NO CUMPLE
	},
	EVALUATION_REQUEST: {
		'PENDIENTE': 1, //EN DILIGENCIAMIENTO POR LA ENTIDAD
		'ERROR': 2, //HAS ERROR
		'POR_ASIGNAR': 3, //POR ASIGNAR
		'SOLICITADO': 4, //SOLICITADO VOLUNTARIAMENTE
		'ASIGNADO': 5, //ASIGNADO POR LA PLATAFORMA
		'ACEPTADO': 6, //ACEPTADO POR EL EVALUADOR
		'RECHAZADO': 7, //RECHAZADO POR EL EVALUADOR
		'RETROALIMENTACION': 8, //EN RETROALIMENTACIÓN
		'CUMPLE': 9, //CUMPLE
		'NO_CUMPLE': 10 //NO_CUMPLE
	}
})
app.controller('backCtrl', function ($mdSidenav, $location, $http) {
	var ctrl = this;
	$http.defaults.headers.common.Authorization = localStorage.getItem("token");

	this.logout = function () {
		delete $http.defaults.headers.common.Authorization;
		localStorage.removeItem("token");
		window.location.href = "/admin/login";
	}
	this.menu = function () {
		$mdSidenav("menu").toggle();
	};
	this.leftMenu = dmt.config;

	this.location = $location

	this.selectPage = function (section, page) {
		$location.path(section.path + "/" + page.path);
	};
	this.navigateTo = function (section) {
		$location.path(section);
	}
});
