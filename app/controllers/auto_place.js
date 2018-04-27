/**  * CONTROLLER AUTO_GENERATED BY DMT-GENERATOR
 * place
 * DMT 2017
 * GENERATED: 5 / 9 / 2017 - 7:39:27
 **/
var BaseController = require('../utils/controller.js')
var util = require('util');
var utiles = require('../utils/utiles.js')
var Errors = require('../utils/errors.js')
var Permissions = require('../utils/permissions.js')
var Auth_ctrl = require('./auth.js')
var entity_institution = require('../models/entity_institution.js')
var institutionType = require('../models/institutionType.js')
var entity_city = require('../models/entity_city.js')
var entity_region = require('../models/entity_region.js')
var entity_country = require('../models/entity_country.js')
var emiter = require('../events/emiter.js').instance
var place_controller = function () {
	var model_entity_institution = new entity_institution()
	var model_institutionType = new institutionType()
	var model_entity_city = new entity_city()
	var model_entity_region = new entity_region()
	var model_entity_country = new entity_country()
	//---------------------------------------------------------------
	var getMap = new Map(), postMap = new Map(), putMap = new Map(), deleteMap = new Map()
	var _get = function(model,user,params){
		let key = model.getPrimaryKey()
		if (params.filter_field) {
			if (typeof params.filter_field == 'string') {
				params.filter_field = [params.filter_field]
				params.filter_value = [params.filter_value]
			}
		} else {
			params.filter_field = []
			params.filter_value = []
		}
		if (params[key]) {
			params.filter_field.push(key)
			params.filter_value.push(params[key])
		}
		return model.getAll({
			filter: params.filter,
			limit: params.limit,
			page: params.page,
			order: params.order,
			filter_fields: params.filter_field,
			filter_values: params.filter_value,
			fields: params.field,
			lang: params.lang
		})
	}
	/**
	 * @api {get} api/place/institution Request institution information
	 * @apiName Getinstitution
	 * @apiGroup place
	 * @apiVersion 1.0.1
	 * 
	 * @apiParam {Number} id institution unique ID.
	 * @apiParam {String} filter Texto to search into DB.
	 * @apiParam {Array} fields Fields where the search have to be fetched.
	 * @apiParam {Number} limit number of items per page.
	 * @apiParam {Number} page number of the page to be fetched.
	 * @apiParam {Number} field to order the results.
	 * @apiParam {Array} filter_field used with filter_value to make specific filters into the data.
	 * @apiParam {Array} filter_value used with filter_field to make specific filters into the data.
	 * @apiParam {String} lang id of the language to get content if available.
	 * 
	 * @apiSuccessExample Success-Response:
	 * HTTP/1.1 200 OK
	 * {
	 * 	data:{
	 *		"id": 100,
	 *		"name": "This is an example text",
	 *		"nit": "This is an example text",
	 *		"address": "This is an example text",
	 *		"website": "This is an example text",
	 *		"email": "This is an example text",
	 *		"second_email": "This is an example text",
	 *		"phone": "This is an example text",
	 *		"extension_phone": "This is an example text",
	 *		"head_sector": 0,
	 *		"timestamp": "1969-05-20",
	 *		"designation_act": "This is an example text",
	 *		"legalrep_name": "This is an example text",
	 *		"legalrep_secondname": "This is an example text",
	 *		"legalrep_lastname": "This is an example text",
	 *		"legalrep_secondlastname": "This is an example text",
	 *		"legalrep_document": "This is an example text",
	 *		"legalrep_typedoc": 20,
	 *		"legalrep_email": "This is an example text",
	 *		"legalrep_phone": "This is an example text",
	 *		"legalrep_mobile": "This is an example text",
	 *		"id_city": 18,
	 *		"id_region": 41,
	 *		"id_country": 90,
	 *		"id_user_creator": 28,
	 *		"id_institution_type": 79
	 *	},
	 * 	total_results:1
	 * }
	*/
	var get_entity_institution = function (user, params) {
		if(!user.permissions || user.permissions.indexOf('admin_institution') == -1){
			if(!params.filter_field){
				params.filter_field = []
				params.filter_value = []
			}else if(typeof params.filter_field === 'string'){
				params.filter_field = [params.filter_field]
				params.filter_value = [params.filter_value]
			}
			params.filter_field.push('active')
			params.filter_value.push('1')
		}
		return _get(model_entity_institution,user,params)
	}
	var get_entity_institution_user = function (user, params) {
		if(!user.permissions || user.permissions.indexOf('admin_institution') == -1){
			throw utiles.informError(100);
		}
		return model_entity_institution.getUser(params.id)
	}
	/**
	 * @api {get} api/place/institutionType Request institutionType information
	 * @apiName GetinstitutionType
	 * @apiGroup place
	 * @apiVersion 1.0.1
	 * 
	 * @apiParam {Number} id institutionType unique ID.
	 * @apiParam {String} filter Texto to search into DB.
	 * @apiParam {Array} fields Fields where the search have to be fetched.
	 * @apiParam {Number} limit number of items per page.
	 * @apiParam {Number} page number of the page to be fetched.
	 * @apiParam {Number} field to order the results.
	 * @apiParam {Array} filter_field used with filter_value to make specific filters into the data.
	 * @apiParam {Array} filter_value used with filter_field to make specific filters into the data.
	 * @apiParam {String} lang id of the language to get content if available.
	 * 
	 * @apiSuccessExample Success-Response:
	 * HTTP/1.1 200 OK
	 * {
	 * 	data:{
	 *		"id": 17,
	 *		"name": "This is an example text"
	 *	},
	 * 	total_results:1
	 * }
	*/
	var get_institutionType = function (user, params) {
		return _get(model_institutionType,user,params)
	}
	/**
	 * @api {get} api/place/city Request city information
	 * @apiName Getcity
	 * @apiGroup place
	 * @apiVersion 1.0.1
	 * 
	 * @apiParam {Number} id city unique ID.
	 * @apiParam {String} filter Texto to search into DB.
	 * @apiParam {Array} fields Fields where the search have to be fetched.
	 * @apiParam {Number} limit number of items per page.
	 * @apiParam {Number} page number of the page to be fetched.
	 * @apiParam {Number} field to order the results.
	 * @apiParam {Array} filter_field used with filter_value to make specific filters into the data.
	 * @apiParam {Array} filter_value used with filter_field to make specific filters into the data.
	 * @apiParam {String} lang id of the language to get content if available.
	 * 
	 * @apiSuccessExample Success-Response:
	 * HTTP/1.1 200 OK
	 * {
	 * 	data:{
	 *		"id": 56,
	 *		"name": "This is an example text",
	 *		"code": "This is an example text",
	 *		"latitude": 20,
	 *		"longitude": 77,
	 *		"id_region": 70
	 *	},
	 * 	total_results:1
	 * }
	*/
	var get_entity_city = function (user, params) {
		return _get(model_entity_city,user,params)
	}
	/**
	 * @api {get} api/place/region Request region information
	 * @apiName Getregion
	 * @apiGroup place
	 * @apiVersion 1.0.1
	 * 
	 * @apiParam {Number} id region unique ID.
	 * @apiParam {String} filter Texto to search into DB.
	 * @apiParam {Array} fields Fields where the search have to be fetched.
	 * @apiParam {Number} limit number of items per page.
	 * @apiParam {Number} page number of the page to be fetched.
	 * @apiParam {Number} field to order the results.
	 * @apiParam {Array} filter_field used with filter_value to make specific filters into the data.
	 * @apiParam {Array} filter_value used with filter_field to make specific filters into the data.
	 * @apiParam {String} lang id of the language to get content if available.
	 * 
	 * @apiSuccessExample Success-Response:
	 * HTTP/1.1 200 OK
	 * {
	 * 	data:{
	 *		"id": 21,
	 *		"name": "This is an example text",
	 *		"id_capital": 51,
	 *		"id_country": 14,
	 *		"code": "This is an example text"
	 *	},
	 * 	total_results:1
	 * }
	*/
	var get_entity_region = function (user, params) {
		return _get(model_entity_region,user,params)
	}
	/**
	 * @api {get} api/place/country Request country information
	 * @apiName Getcountry
	 * @apiGroup place
	 * @apiVersion 1.0.1
	 * 
	 * @apiParam {Number} id country unique ID.
	 * @apiParam {String} filter Texto to search into DB.
	 * @apiParam {Array} fields Fields where the search have to be fetched.
	 * @apiParam {Number} limit number of items per page.
	 * @apiParam {Number} page number of the page to be fetched.
	 * @apiParam {Number} field to order the results.
	 * @apiParam {Array} filter_field used with filter_value to make specific filters into the data.
	 * @apiParam {Array} filter_value used with filter_field to make specific filters into the data.
	 * @apiParam {String} lang id of the language to get content if available.
	 * 
	 * @apiSuccessExample Success-Response:
	 * HTTP/1.1 200 OK
	 * {
	 * 	data:{
	 *		"id": 77,
	 *		"name": "This is an example text",
	 *		"id_capital": 13,
	 *		"id_country": 20,
	 *		"code": "This is an example text"
	 *	},
	 * 	total_results:1
	 * }
	*/
	var get_entity_country = function (user, params) {
		params.order="name asc"
		return _get(model_entity_country,user,params)
	}
	getMap.set('institution', { method: get_entity_institution, permits: Permissions.NONE })
	getMap.set('institutionUser', { method: get_entity_institution_user, permits: Permissions.NONE })
	getMap.set('institutionType', { method: get_institutionType, permits: Permissions.NONE })
	getMap.set('city', { method: get_entity_city, permits: Permissions.NONE })
	getMap.set('region', { method: get_entity_region, permits: Permissions.NONE })
	getMap.set('country', { method: get_entity_country, permits: Permissions.NONE })
	/**
	 * @api {post} api/place/institution Create institution information
	 * @apiName Postinstitution
	 * @apiGroup place
	 * @apiVersion 1.0.1
	 * 
	 * @apiParam {Number} id 
	 * @apiParam {String} name 
	 * @apiParam {String} nit 
	 * @apiParam {String} address 
	 * @apiParam {String} website 
	 * @apiParam {String} email 
	 * @apiParam {String} second_email 
	 * @apiParam {String} phone 
	 * @apiParam {String} extension_phone 
	 * @apiParam {Boolean} head_sector 
	 * @apiParam {Date} timestamp 
	 * @apiParam {String} designation_act 
	 * @apiParam {String} legalrep_name 
	 * @apiParam {String} legalrep_secondname 
	 * @apiParam {String} legalrep_lastname 
	 * @apiParam {String} legalrep_secondlastname 
	 * @apiParam {String} legalrep_document 
	 * @apiParam {Number} legalrep_typedoc 
	 * @apiParam {String} legalrep_email 
	 * @apiParam {String} legalrep_phone 
	 * @apiParam {String} legalrep_mobile 
	 * @apiParam {Number} id_city 
	 * @apiParam {Number} id_region 
	 * @apiParam {Number} id_country 
	 * @apiParam {Number} id_user_creator 
	 * @apiParam {Number} id_institution_type 
 	 * 
	 */
	var create_entity_institution = function (user, body) {
		body.id_user_creator = user.id
		return model_entity_institution.create(body)
	}
	/**
	 * @api {post} api/place/institutionType Create institutionType information
	 * @apiName PostinstitutionType
	 * @apiGroup place
	 * @apiVersion 1.0.1
	 * 
	 * @apiParam {Number} id 
	 * @apiParam {String} name 
 	 * 
	 */
	var create_institutionType = function (user, body) {
		return model_institutionType.create(body)
	}
	/**
	 * @api {post} api/place/city Create city information
	 * @apiName Postcity
	 * @apiGroup place
	 * @apiVersion 1.0.1
	 * 
	 * @apiParam {Number} id 
	 * @apiParam {String} name 
	 * @apiParam {String} code 
	 * @apiParam {Number} latitude 
	 * @apiParam {Number} longitude 
	 * @apiParam {Number} id_region 
 	 * 
	 */
	var create_entity_city = function (user, body) {
		return model_entity_city.create(body)
	}
	/**
	 * @api {post} api/place/region Create region information
	 * @apiName Postregion
	 * @apiGroup place
	 * @apiVersion 1.0.1
	 * 
	 * @apiParam {Number} id 
	 * @apiParam {String} name 
	 * @apiParam {Number} id_capital 
	 * @apiParam {Number} id_country 
	 * @apiParam {String} code 
 	 * 
	 */
	var create_entity_region = function (user, body) {
		return model_entity_region.create(body)
	}
	/**
	 * @api {post} api/place/country Create country information
	 * @apiName Postcountry
	 * @apiGroup place
	 * @apiVersion 1.0.1
	 * 
	 * @apiParam {Number} id 
	 * @apiParam {String} name 
	 * @apiParam {Number} id_capital 
	 * @apiParam {Number} id_country 
	 * @apiParam {String} code 
 	 * 
	 */
	var create_entity_country = function (user, body) {
		return model_entity_country.create(body)
	}
	postMap.set('institution', { method: create_entity_institution, permits: Permissions.ADMIN_INSTITUTION })
	postMap.set('institutionType', { method: create_institutionType, permits: Permissions.ADMIN_INSTITUTION })
	postMap.set('city', { method: create_entity_city, permits: Permissions.ADMIN_CITIES_REGIONS })
	postMap.set('region', { method: create_entity_region, permits: Permissions.ADMIN_CITIES_REGIONS })
	postMap.set('country', { method: create_entity_country, permits: Permissions.ADMIN_CITIES_REGIONS })
	/**
	 * @api {put} api/place/institution Update institution information
	 * @apiName Putinstitution
	 * @apiGroup place
	 * @apiVersion 1.0.1
	 * 
	 * @apiParam {Number} id 
	 * @apiParam {String} name 
	 * @apiParam {String} nit 
	 * @apiParam {String} address 
	 * @apiParam {String} website 
	 * @apiParam {String} email 
	 * @apiParam {String} second_email 
	 * @apiParam {String} phone 
	 * @apiParam {String} extension_phone 
	 * @apiParam {Boolean} head_sector 
	 * @apiParam {Date} timestamp 
	 * @apiParam {String} designation_act 
	 * @apiParam {String} legalrep_name 
	 * @apiParam {String} legalrep_secondname 
	 * @apiParam {String} legalrep_lastname 
	 * @apiParam {String} legalrep_secondlastname 
	 * @apiParam {String} legalrep_document 
	 * @apiParam {Number} legalrep_typedoc 
	 * @apiParam {String} legalrep_email 
	 * @apiParam {String} legalrep_phone 
	 * @apiParam {String} legalrep_mobile 
	 * @apiParam {Number} id_city 
	 * @apiParam {Number} id_region 
	 * @apiParam {Number} id_country 
	 * @apiParam {Number} id_user_creator 
	 * @apiParam {Number} id_institution_type 
 	 * 
	 */
	var update_entity_institution = function (user, body) {
		if (!body.id) {
			throw utiles.informError(400)
		}
		if(user.permissions.indexOf(Permissions.ADMIN_INSTITUTION)== -1){
			if (!user.institutions) {
				throw utiles.informError(401)
			}
			let forbidden = true
			user.institutions.forEach((institution)=>{
				if(institution.id == body.id){
					forbidden = false
				}
			})
			if(forbidden){
				throw utiles.informError(401)
			}
			body.id_user_creator = user.id
		}
		return model_entity_institution.update(body,{id:body.id})
	}
	/**
	 * @api {put} api/place/institutionType Update institutionType information
	 * @apiName PutinstitutionType
	 * @apiGroup place
	 * @apiVersion 1.0.1
	 * 
	 * @apiParam {Number} id 
	 * @apiParam {String} name 
 	 * 
	 */
	var update_institutionType = function (user, body) {
		if (!body.id) {
			throw utiles.informError(400)
		}
		return model_institutionType.update(body,{id:body.id})
	}
	/**
	 * @api {put} api/place/city Update city information
	 * @apiName Putcity
	 * @apiGroup place
	 * @apiVersion 1.0.1
	 * 
	 * @apiParam {Number} id 
	 * @apiParam {String} name 
	 * @apiParam {String} code 
	 * @apiParam {Number} latitude 
	 * @apiParam {Number} longitude 
	 * @apiParam {Number} id_region 
 	 * 
	 */
	var update_entity_city = function (user, body) {
		if (!body.id) {
			throw utiles.informError(400)
		}
		return model_entity_city.update(body,{id:body.id})
	}
	/**
	 * @api {put} api/place/region Update region information
	 * @apiName Putregion
	 * @apiGroup place
	 * @apiVersion 1.0.1
	 * 
	 * @apiParam {Number} id 
	 * @apiParam {String} name 
	 * @apiParam {Number} id_capital 
	 * @apiParam {Number} id_country 
	 * @apiParam {String} code 
 	 * 
	 */
	var update_entity_region = function (user, body) {
		if (!body.id) {
			throw utiles.informError(400)
		}
		return model_entity_region.update(body,{id:body.id})
	}
	/**
	 * @api {put} api/place/country Update country information
	 * @apiName Putcountry
	 * @apiGroup place
	 * @apiVersion 1.0.1
	 * 
	 * @apiParam {Number} id 
	 * @apiParam {String} name 
	 * @apiParam {Number} id_capital 
	 * @apiParam {Number} id_country 
	 * @apiParam {String} code 
 	 * 
	 */
	var update_entity_country = function (user, body) {
		if (!body.id) {
			throw utiles.informError(400)
		}
		return model_entity_country.update(body,{id:body.id})
	}
	putMap.set('institution', { method: update_entity_institution, permits: Permissions.NONE })
	putMap.set('institutionType', { method: update_institutionType, permits: Permissions.ADMIN_INSTITUTION })
	putMap.set('city', { method: update_entity_city, permits: Permissions.ADMIN_CITIES_REGIONS })
	putMap.set('region', { method: update_entity_region, permits: Permissions.ADMIN_CITIES_REGIONS })
	putMap.set('country', { method: update_entity_country, permits: Permissions.ADMIN_CITIES_REGIONS })
	/**
	 * @api {delete} api/place/institution Delete institution information
	 * @apiName Deleteinstitution
	 * @apiGroup place
	 * @apiVersion 1.0.1
	 * 
	 * @apiParam {Number} id 
	 * @apiParam {String} name 
	 * @apiParam {String} nit 
	 * @apiParam {String} address 
	 * @apiParam {String} website 
	 * @apiParam {String} email 
	 * @apiParam {String} second_email 
	 * @apiParam {String} phone 
	 * @apiParam {String} extension_phone 
	 * @apiParam {Boolean} head_sector 
	 * @apiParam {Date} timestamp 
	 * @apiParam {String} designation_act 
	 * @apiParam {String} legalrep_name 
	 * @apiParam {String} legalrep_secondname 
	 * @apiParam {String} legalrep_lastname 
	 * @apiParam {String} legalrep_secondlastname 
	 * @apiParam {String} legalrep_document 
	 * @apiParam {Number} legalrep_typedoc 
	 * @apiParam {String} legalrep_email 
	 * @apiParam {String} legalrep_phone 
	 * @apiParam {String} legalrep_mobile 
	 * @apiParam {Number} id_city 
	 * @apiParam {Number} id_region 
	 * @apiParam {Number} id_country 
	 * @apiParam {Number} id_user_creator 
	 * @apiParam {Number} id_institution_type 
 	 * 
	 */
	var delete_entity_institution = function (user, body) {
		if (!body.id) {
			throw utiles.informError(400)
		}
		return model_entity_institution.delete(body,{id:body.id})
	}
	/**
	 * @api {delete} api/place/institutionType Delete institutionType information
	 * @apiName DeleteinstitutionType
	 * @apiGroup place
	 * @apiVersion 1.0.1
	 * 
	 * @apiParam {Number} id 
	 * @apiParam {String} name 
 	 * 
	 */
	var delete_institutionType = function (user, body) {
		if (!body.id) {
			throw utiles.informError(400)
		}
		return model_institutionType.delete(body,{id:body.id})
	}
	/**
	 * @api {delete} api/place/city Delete city information
	 * @apiName Deletecity
	 * @apiGroup place
	 * @apiVersion 1.0.1
	 * 
	 * @apiParam {Number} id 
	 * @apiParam {String} name 
	 * @apiParam {String} code 
	 * @apiParam {Number} latitude 
	 * @apiParam {Number} longitude 
	 * @apiParam {Number} id_region 
 	 * 
	 */
	var delete_entity_city = function (user, body) {
		if (!body.id) {
			throw utiles.informError(400)
		}
		return model_entity_city.delete(body,{id:body.id})
	}
	/**
	 * @api {delete} api/place/region Delete region information
	 * @apiName Deleteregion
	 * @apiGroup place
	 * @apiVersion 1.0.1
	 * 
	 * @apiParam {Number} id 
	 * @apiParam {String} name 
	 * @apiParam {Number} id_capital 
	 * @apiParam {Number} id_country 
	 * @apiParam {String} code 
 	 * 
	 */
	var delete_entity_region = function (user, body) {
		if (!body.id) {
			throw utiles.informError(400)
		}
		return model_entity_region.delete(body,{id:body.id})
	}
	/**
	 * @api {delete} api/place/country Delete country information
	 * @apiName Deletecountry
	 * @apiGroup place
	 * @apiVersion 1.0.1
	 * 
	 * @apiParam {Number} id 
	 * @apiParam {String} name 
	 * @apiParam {Number} id_capital 
	 * @apiParam {Number} id_country 
	 * @apiParam {String} code 
 	 * 
	 */
	var delete_entity_country = function (user, body) {
		if (!body.id) {
			throw utiles.informError(400)
		}
		return model_entity_country.delete(body,{id:body.id})
	}
	deleteMap.set('institution', { method: delete_entity_institution, permits: Permissions.ADMIN_INSTITUTION })
	deleteMap.set('institutionType', { method: delete_institutionType, permits: Permissions.ADMIN_INSTITUTION })
	deleteMap.set('city', { method: delete_entity_city, permits: Permissions.ADMIN_CITIES_REGIONS })
	deleteMap.set('region', { method: delete_entity_region, permits: Permissions.ADMIN_CITIES_REGIONS })
	deleteMap.set('country', { method: delete_entity_country, permits: Permissions.ADMIN_CITIES_REGIONS })
	var params = [getMap, postMap, putMap, deleteMap]
	BaseController.apply(this, params)
	//---------------------------------------------------------------
	return this;
}
util.inherits(place_controller, BaseController)
module.exports = place_controller