if (!dmt) {
	var dmt = {}
}
let date = new Date()
dmt.config = [
	{
		section: "Reportes",
		path: "reoportes",
		pages:[
			{
				name:"Listado",
				path: "consolidado",
				controller: "reportsController",
				templateUrl: "views/reports/detail.html",
				permission:'admin_platform'
			}
		]
	},
	{
		section: "General",
		path: "general",
		pages:[
			{
				name:"Logos",
				path: "logos",
				filters:{
					'id':[1]
				},
				entity: "config",
				controller: "detailItemController",
				templateUrl: "views/logos/detail.html",
				permission:'admin_config'
			},
			{
				name: "Banner",
				path: "banner",
				entity: "banner",
				controller: "bannerListController",
				templateUrl: "views/banner/list.html",
				permission:'admin_platform',
				pages: [
					{
						name: "add",
						path: "add",
						controller: "bannerDetailController",
						templateUrl: "views/banner/detail.html",
						permission:'admin_platform'
					},
					{
						name: "detail",
						path: "detail/:id",
						controller: "bannerDetailController",
						templateUrl: "views/banner/detail.html",
						permission:'admin_platform'
					}
				]
			},
			{
				name: "Salón de la fama",
				path: "hall",
				entity: "hall_of_fame",
				controller: 'hallFameController',
				templateUrl: "views/hall/list.html",
				permission:'admin_hall'
			},
			{
				name: "Pie de página",
				path: "pie_pagina",
				filters:{
					'id':[1]
				},
				entity: "footer",
				controller: "detailItemController",
				templateUrl: "views/footer/detail.html",
				permission:'admin_platform'
			},
		]
	},
	{
		section: "Usuarios",
		path: "usuarios",
		pages:[
			{
				name: "Entidades",
				path: "entidades",
				entity: "institution",
				controller: "listItemEntityController",
				templateUrl: "views/entity/list.html",
				permission:'admin_institution',
				pages: [
					{
						name: "add",
						path: "add",
						controller: "detailItemEntityController",
						templateUrl: "views/entity/detail.html",
						permission:'admin_users'
					},
					{
						name: "detail",
						path: "detail/:id",
						controller: "detailItemEntityController",
						templateUrl: "views/entity/detail.html",
						permission:'admin_users'
					}
				]
			},
			{
				name: "Representantes",
				path: "representantes",
				entity: "user",
				controller: "representantListController",
				templateUrl: "views/representant/list.html",
				permission:'admin_users',
				filters:{
					'roles.id':[4]
				},
				pages: [
					{
						name: "detail",
						path: "detail/:id",
						controller: "detailItemRepresentantController",
						templateUrl: "views/representant/detail.html",
						permission:'admin_users'
					}
				]
			},
			{
				name: "Evaluadores",
				path: "evaluadores",
				entity: "user",
				controller: "evaluatortListController",
				templateUrl: "views/evaluator/list.html",
				permission:'admin_users',
				filters:{
					'roles.id':[2]
				},
				pages: [
					{
						name: "add",
						path: "add",
						controller: "evaluatorDetailController",
						templateUrl: "views/evaluator/detail.html",
						permission:'admin_users'
					},
					{
						name: "detail",
						path: "detail/:id",
						controller: "evaluatorDetailController",
						templateUrl: "views/evaluator/detail.html",
						permission:'admin_users'
					}
				]
			},
			{
				name: "Ciudadanos",
				path: "ciudadanos",
				entity: "user",
				controller: "citizenListController",
				templateUrl: "views/citizen/list.html",
				permission:'admin_users',
				filters:{
					'roles.id':[1]
				},
				pages: [
					{
						name: "add",
						path: "add",
						controller: "citizenDetailController",
						templateUrl: "views/citizen/detail.html",
						permission:'admin_users'
					},
					{
						name: "detail",
						path: "detail/:id",
						controller: "citizenDetailController",
						templateUrl: "views/citizen/detail.html",
						permission:'admin_users'
					}
				]
			},
			{
				name: "Administradores",
				path: "administradores",
				entity: "user",
				controller: "admonListController",
				templateUrl: "views/admon/list.html",
				permission:'admin_users',
				filters:{
					'roles.id':['!= 1','!= 2','!= 4']
				},
				pages: [
					{
						name: "add",
						path: "add",
						controller: "detailItemUserController",
						templateUrl: "views/admon/detail.html",
						permission:'admin_users'
					},
					{
						name: "detail",
						path: "detail/:id",
						controller: "detailItemUserController",
						templateUrl: "views/admon/detail.html",
						permission:'admin_users'
					}
				]
			}
		]
	},
	{
		section: "Postulaciones",
		path: "postulaciones",
		pages: [
			{
				name: "En Validación",
				path: "validacion",
				entity: "service",
				filters:{
					'current_status':[2]
				},
				controller: "servicesListController",
				templateUrl: "views/service/list.html",
				permission:'admin_services',
				pages: [
					{
						name: "add",
						path: "add",
						controller: "servicesDetailController",
						templateUrl: "views/service/detail.html",
						permission:'admin_services'
					},
					{
						name: "detail",
						path: "detail/:id",
						controller: "servicesDetailController",
						templateUrl: "views/service/detail.html",
						permission:'admin_services'
					}
				]
			},
			{
				name: "En Proceso",
				path: "evaluacion",
				entity: "service",
				filters:{
					'current_status':[3]
				},
				controller: "servicesListController",
				templateUrl: "views/service/list.html",
				permission:'admin_services',
				pages: [
					{
						name: "add",
						path: "add",
						controller: "servicesDetailController",
						templateUrl: "views/service/detail.html",
						permission:'admin_services'
					},
					{
						name: "detail",
						path: "detail/:id",
						controller: "servicesDetailController",
						templateUrl: "views/service/detail.html",
						permission:'admin_services'
					}
				]
			},
			{
				name: "Otorgados",
				path: "cumplidos",
				entity: "service",
				filters:{
					'history.id_status':[4],
					'history.valid_to' : ['> ' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()]
				},
				controller: "servicesListController",
				templateUrl: "views/service/list.html",
				permission:'admin_services',
				pages: [
					{
						name: "add",
						path: "add",
						controller: "servicesDetailController",
						templateUrl: "views/service/detail.html",
						permission:'admin_services'
					},
					{
						name: "detail",
						path: "detail/:id",
						controller: "servicesDetailController",
						templateUrl: "views/service/detail.html",
						permission:'admin_services'
					}
				]
			},
			{
				name: "No Otorgados",
				path: "no_cumplidos",
				entity: "service",
				filters:{
					'current_status':[5]
				},
				controller: "servicesListController",
				templateUrl: "views/service/list.html",
				permission:'admin_services',
				pages: [
					{
						name: "add",
						path: "add",
						controller: "servicesDetailController",
						templateUrl: "views/service/detail.html",
						permission:'admin_services'
					},
					{
						name: "detail",
						path: "detail/:id",
						controller: "servicesDetailController",
						templateUrl: "views/service/detail.html",
						permission:'admin_services'
					}
				]
			},
			{
				name: "Todos los servicios",
				path: "todos",
				entity: "service",
				controller: "servicesListController",
				templateUrl: "views/service/all_list.html",
				permission:'admin_services',
				pages: [
					{
						name: "add",
						path: "add",
						controller: "servicesDetailController",
						templateUrl: "views/service/detail.html",
						permission:'admin_services'
					},
					{
						name: "detail",
						path: "detail/:id",
						controller: "servicesDetailController",
						templateUrl: "views/service/detail.html",
						permission:'admin_services'
					}
				]
			},
			{
				name: "Evaluaciones Urgentes",
				path: "urgente",
				entity: "user_answer",
				controller: "urgentAnswerController",
				templateUrl: "views/answer/urgent.html",
				permission:'admin_evaluation_request'
			}
		]
	},
	{
		section: "Administrar",
		path: "administrar",
		pages: [
			{
				name: "Tipos de Evaluador",
				path: "tipos_evaluador",
				entity: "usertype",
				permission:'admin_config'
			},
			{
				name: "Categorías",
				path: "categorias",
				entity: "category",
				permission:'admin_config'
			},
			{
				name: "Temáticas de interés",
				path: "tematicas_interes",
				entity: "questiontopic",
				permission:'admin_config',
				templateUrl: "views/questiontopic/list.html",
			},
			{
				name: "Requisitos",
				path: "requisitos",
				entity: "question",
				controller: "questionListController",
				templateUrl: "views/question/list.html",
				permission:'admin_questions',
				pages: [
					{
						name: "add",
						path: "add",
						controller: "questionDetailController",
						templateUrl: "views/question/detail.html",
						permission:'admin_questions'
					},
					{
						name: "detail",
						path: "detail/:id",
						controller: "questionDetailController",
						templateUrl: "views/question/detail.html",
						permission:'admin_questions'
					}
				]
			},
			{
				name: "Tiempos / Requisito",
				path: "tiempos_requisito",
				entity: "request_status",
				permission:'admin_status',
				controller: "listItemRequestStatusController",
				templateUrl: "views/status/list.html",
				readOnly:true
			},
			{
				name: "Tiempos / Servicio",
				path: "tiempos_servicio",
				entity: "status",
				permission:'admin_status',
				controller: "listItemStatusController",
				templateUrl: "views/status/list.html",
				readOnly:true
			},
			{
				name: "Puntaje",
				path: "puntaje",
				entity: "motives",
				controller: "pointsListController",
				templateUrl: "views/points/list.html",
				permission:'admin_motives',
				pages: [
					{
						name: "add",
						path: "add",
						controller: "pointsDetailController",
						templateUrl: "views/points/detail.html",
						permission:'admin_motives',
					},
					{
						name: "detail",
						path: "detail/:id",
						controller: "pointsDetailController",
						templateUrl: "views/points/detail.html",
						permission:'admin_motives',
					}
				]
			},
			{
				name: "Aprende y Enseña",
				path: "aprende_ensena",
				entity: "hangouts",
				controller: "learnListController",
				templateUrl: "views/learn/list.html",
				permission:'admin_hangouts',
				pages: [
					{
						name: "add",
						path: "add",
						controller: "learnDetailController",
						templateUrl: "views/learn/detail.html",
						permission:'admin_hangouts',
					},
					{
						name: "detail",
						path: "detail/:id",
						controller: "learnDetailController",
						templateUrl: "views/learn/detail.html",
						permission:'admin_hangouts',
					}
				]
			},
			{
				name: "Preguntas Ciudadano",
				path: "preguntas",
				entity: "category_questions",
				permission:'admin_questions',
			},
			{
				name: "Perfiles",
				path: "roles",
				entity: "role",
				controller: "rolesListController",
				templateUrl: "views/roles/list.html",
				permission:'admin_config',
				pages: [
					{
						name: "add",
						path: "add",
						controller: "rolesDetailController",
						templateUrl: "views/roles/detail.html",
						permission:'admin_config',
					},
					{
						name: "detail",
						path: "detail/:id",
						controller: "rolesDetailController",
						templateUrl: "views/roles/detail.html",
						permission:'admin_config',
					}
				]
			},
			{
				name: "Ciudades",
				path: "ciudades",
				entity: "city",
				permission:'admin_cities_regions',
				controller:'listItemExtendedController',
				templateUrl: "views/extended/list.html",
				pages: [
					{
						name: "add",
						path: "add",
						controller: "detailItemCityController",
						templateUrl: "views/country/city.html",
						permission:'admin_cities_regions',
					},
					{
						name: "detail",
						path: "detail/:id",
						controller: "detailItemCityController",
						templateUrl: "views/country/city.html",
						permission:'admin_cities_regions',
					}
				]
			},
			{
				name: "Regiones",
				path: "regiones",
				entity: "region",
				permission:'admin_cities_regions',
				controller:'listItemExtendedController',
				templateUrl: "views/extended/list.html",
				pages: [
					{
						name: "add",
						path: "add",
						controller: "detailItemRegionController",
						templateUrl: "views/country/region.html",
						permission:'admin_cities_regions',
					},
					{
						name: "detail",
						path: "detail/:id",
						controller: "detailItemRegionController",
						templateUrl: "views/country/region.html",
						permission:'admin_cities_regions',
					}
				]
			},
			{
				name: "Paises",
				path: "paises",
				entity: "country",
				permission:'admin_cities_regions',
				controller:'listItemExtendedController',
				templateUrl: "views/extended/list.html",
				pages: [
					{
						name: "add",
						path: "add",
						controller: "detailItemCountryController",
						templateUrl: "views/country/country.html",
						permission:'admin_cities_regions',
					},
					{
						name: "detail",
						path: "detail/:id",
						controller: "detailItemCountryController",
						templateUrl: "views/country/country.html",
						permission:'admin_cities_regions',
					}
				]
			},
			{
				name: "Tipos de Documento",
				path: "tipos_documento",
				entity: "type_document",
				permission:'admin_type_document',
			},
		]
	}
]
try {
	module.exports = dmt;
} catch (e) {
	console.log(e);
}