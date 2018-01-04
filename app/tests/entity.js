var assert = require('assert');
var request = require('request');
var http = require('http');

describe('Test de conexión', function () {
	it('App responding', function (done) {
		let options = {}
		options.url = 'http://localhost:3000/health';
		request.get(options, (err, res, body) => {
			assert.equal(res.statusCode, 200, "StatusCode must be 200");
			done()
		});
	});
});

let model_availability = new (require('../models/availability.js'))()
let model_category = new (require('../models/category.js'))()
let model_city = new (require('../models/city.js'))()
let model_country = new (require('../models/country.js'))()
let model_entity_evaluation_request = new (require('../models/entity_evaluation_request.js'))()
let model_entity_institution = new (require('../models/entity_institution.js'))()
let model_entity_points = new (require('../models/entity_points.js'))()
let model_entity_question = new (require('../models/entity_question.js'))()
let model_entity_questiontopic = new (require('../models/entity_questiontopic.js'))()
let model_entity_service = new (require('../models/entity_service.js'))()
let model_entity_user = new (require('../models/entity_user.js'))()
let model_entity_user_answer = new (require('../models/entity_user_answer.js'))()
let model_institution_user = new (require('../models/institution_user.js'))()
let model_region = new (require('../models/region.js'))()
let model_session = new (require('../models/session.js'))()
let model_type_document = new (require('../models/type_document.js'))()
let model_user_role = new (require('../models/user_role.js'))()
let model_entity_hangouts = new (require('../models/entity_hangouts.js'))()
let CONSTANTS = require('../events/constants.js')
send = function (options, data, delayed) {
	return new Promise((resolve, reject) => {
		let tout = 0
		if (delayed) {
			tout = Math.floor(Math.random() * 5000) + 0
		}
		setTimeout((params) => {
			const req = http.request(params.options, (res) => {
				let data = '';
				if (res.statusCode != 200) {
					params.reject(res)
				}
				res.setEncoding('utf8');
				res.on('data', (chunk) => {
					data += chunk
				});
				res.on('end', () => {
					params.resolve(JSON.parse(data))
				});
			});

			req.on('error', (e) => {
				params.reject(e)
			});
			// write data to request body
			req.write(params.data);
			req.end();
		},tout,{
			'options':options,
			'data':data,
			'resolve':resolve,
			'reject':reject})
	})
}
cleanUser = function (user, service) {
	let promises = []
	promises.push(model_institution_user.delete({ id_user: user.id }))
	promises.push(model_user_role.delete({ id_user: user.id }))
	promises.push(model_session.delete({ id_user: user.id }))
	promises.push(model_session.delete({ id_user: user.id }))
	if (service) {
		promises.push(model_entity_evaluation_request.delete({ id_service: service.id }))
	} else {
		promises.push(model_entity_evaluation_request.delete({ id_user: user.id }))
	}


	return Promise.all(promises).then((result) => {
		if (service) {
			return model_entity_user_answer.delete({ id_service: service.id })
		} else {
			return model_entity_user_answer.delete({ id_user: user.id })
		}
	}).then((result) => {
		return model_entity_user.delete({ id: user.id })
	}).then((result) => {
		return model_entity_service.delete(user.id)
	}).then((result) => {
		return model_entity_points.delete({ id_user: user.id })
	})
}
describe('Test de Entidad', function () {
	this.timeout(15000);
	let user = null
	let token = null
	let institution = null
	let service = null
	let answers = []
	let bad_answer = null
	
	before(function (done) {
		let user = null
		let service = null
		model_entity_user.getByParams({ email: 'daniel@domoti.rocks' }).then((result) => {
			if (result.data.length) {
				user = result.data[0]
				return model_entity_service.getByParams({ id_user: user.id })
			} else {
				return
			}
		}).then((result) => {
			if (result) {
				if (result.data.length) {
					service = result.data[0]
				}
			}
			if (user) {
				return cleanUser(user, service)
			}
			return
		}).then(() => {
			done()
		})
	})

	it('Registrarse', (done) => {
		let promises = []
		promises.push(model_entity_institution.getByUid(1))
		promises.push(model_country.getByUid(42))
		promises.push(model_region.getByParams({ id_country: 42 }))
		promises.push(model_city.getByParams({ id_region: 1 }))
		promises.push(model_availability.getByUid(1))
		promises.push(model_type_document.getByUid(1))
		const result = Promise.all(promises)
			.then((results) => {
				institution = results[0].data[0]
				let user = {
					id_country: results[1][0].id,
					id_region: results[2][0].id,
					id_city: results[3][0].id,
					id_availability: results[4][0].id,
					id_type_document: results[5][0].id,
					name: 'Auto',
					secondname: 'Auto',
					lastname: 'Lastname',
					secondlastname: 'Entity',
					email: 'daniel@domoti.rocks',
					password: 'testerpwd',
					phone: '',
					mobile: '',
					document: '',
					terms: 1,
					institution: {
						id: results[0].data[0].id,
						id_institution_type: results[0].data[0].id_institution_type,
						nit: results[0].data[0].nit,
						email: results[0].data[0].email,
						phone: results[0].data[0].phone
					}
				}
				return user
			}).then((user) => {
				const data = JSON.stringify(user)
				return send({
					hostname: 'localhost',
					port: 3000,
					path: '/api/auth/register_entity',
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Content-Length': Buffer.byteLength(data)
					}
				}, data
				)
			}).then(result => {
				user = result.data
				done()
			})
	})
	it('Activar Cuenta', (done) => {
		let options = {}
		options.url = 'http://localhost:3000/api/auth/activate?email='+user.email;
		request.get(options, (err, res, body) => {
			assert.equal(res.statusCode, 200, "StatusCode must be 200");
			done()
		});
	})
	it('Login', (done) => {
		let login = {
			email: user.email,
			password: 'testerpwd'
		}
		const data = JSON.stringify(login)
		send({
			hostname: 'localhost',
			port: 3000,
			path: '/api/auth/login',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': Buffer.byteLength(data)
			}
		}, data)
			.then((result) => {
				token = result.token
				assert.equal(token.split('.').length, 3, 'token invalido')
				done()
			})
	})
	it('Cambiar Contraseña', (done) => {
		let pwd = {
			email: user.email,
			old: 'testerpwd',
			password: 'testerpwdnew'
		}
		const data = JSON.stringify(pwd)
		send({
			hostname: 'localhost',
			port: 3000,
			path: '/api/auth/password',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': Buffer.byteLength(data),
				'Authorization': token
			}
		}, data).then((result) => {
			assert.equal(result.error.code, 0, 'Error al Cambiar la Contraseña')
			done()
		})
	})
	it('Renovando Token', (done) => {
		const data = JSON.stringify({})
		send({
			hostname: 'localhost',
			port: 3000,
			path: '/api/auth/renew',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': Buffer.byteLength(data),
				'Authorization': token
			}
		}, data).then((result) => {
			token = result.token
			assert.equal(token.split('.').length, 3, 'token invalido')
			done()
		})
	})
	it('Crear Servicio', (done) => {
		let promises = []
		promises.push(model_category.getByUid(1))
		Promise.all(promises)
			.then((results) => {
				category = results[0][0]
				let _s = {
					name: 'Servicio de Prueba Creado en TEST Controller',
					id_institution: institution.id,
					id_category: category.id,
					id_user: user.id,
					test_user: 'Usuario de prueba',
					test_password: 'Password',
					level: 1
				}
				const data = JSON.stringify(_s)
				return send({
					hostname: 'localhost',
					port: 3000,
					path: '/api/service/service',
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Content-Length': Buffer.byteLength(data),
						'Authorization': token
					}
				}, data)
			}).then((result) => {
				service = result
				done()
			})
	})
	it('Crear Respuestas', (done) => {
		let promises = []
		promises.push(model_entity_question.getFiltered({ id_level: 1, 'topic.id_category': category.id }))
		Promise.all(promises).then((results) => {
			let questions = results[0].data
			let _promises = []
			questions.forEach((question) => {
				let data = JSON.stringify({
					id_question: question.id,
					id_user: user.id,
					id_topic: question.id_topic,
					id_service: service.id,
					id_status: CONSTANTS.SERVICE.VERIFICACION,
					comment: 'Respuesta test'
				})
				_promises.push(send({
					hostname: 'localhost',
					port: 3000,
					path: '/api/question/user_answer',
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Content-Length': Buffer.byteLength(data),
						'Authorization': token
					}
				}, data))
			})
			return Promise.all(_promises)
		}).then((result) => {
			answers = result
			done()
		})
	})
	it('Actualizar Respuestas', (done) => {
		let _promises = []
		answers.forEach((answer) => {
			let data = JSON.stringify({
				id: answer.id,
				comment: 'Respuesta test Actualizada'
			})
			_promises.push(send({
				hostname: 'localhost',
				port: 3000,
				path: '/api/question/user_answer',
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Content-Length': Buffer.byteLength(data),
					'Authorization': token
				}
			}, data))
		})
		Promise.all(_promises).then((result) => {
			answers = result
			done()
		})
	})
	it('Postular Servicio', (done) => {
		let data = JSON.stringify({
			id: service.id,
			current_status: CONSTANTS.SERVICE.VERIFICACION
		})
		send({
			hostname: 'localhost',
			port: 3000,
			path: '/api/service/service',
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': Buffer.byteLength(data),
				'Authorization': token
			}
		}, data).then((result) => {
			service = result
			done()
		})
	})
	it('Rechazar Respuesta', (done) => {
		let idx = Math.floor(Math.random() * answers.length)
		bad_answer = answers[idx]

		let data = JSON.stringify({
			id: bad_answer.id,
			id_status: CONSTANTS.SERVICE.INCOMPLETO
		})
		send({
			hostname: 'localhost',
			port: 3000,
			path: '/api/question/user_answer',
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': Buffer.byteLength(data),
				'Authorization': token
			}
		}, data).then((result)=>{
			bad_answer = result
			done()
		})
	})
	it('Corregir Respuestas', (done) => {
		let data = JSON.stringify({
			id: bad_answer.id,
			comment: 'Respuesta Ajustada',
			id_status: CONSTANTS.SERVICE.VERIFICACION
		})
		send({
			hostname: 'localhost',
			port: 3000,
			path: '/api/question/user_answer',
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': Buffer.byteLength(data),
				'Authorization': token
			}
		}, data).then((result)=>{
			bad_answer = result
			done()
		})
	})
	it('Aceptar Servicio', (done) => {
		let _promises = []
		answers.forEach((answer) => {
			let data = JSON.stringify({
				id: answer.id,
				id_status: CONSTANTS.SERVICE.ASIGNACION
			})
			_promises.push(send({
				hostname: 'localhost',
				port: 3000,
				path: '/api/question/user_answer',
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Content-Length': Buffer.byteLength(data),
					'Authorization': token
				}
			}, data, true))
		})
		Promise.all(_promises).then((result) => {
			answers = result
			done()
		})
	})
	it('Ver Video', (done) => {
		model_entity_hangouts.getByParams({ id_role: 4 })
			.then((results) => {
				let video = results.data[0]
				let data = JSON.stringify({ id: video.id })
				return send({
					hostname: 'localhost',
					port: 3000,
					path: '/api/forum/view',
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Content-Length': Buffer.byteLength(data),
						'Authorization': token
					}
				}, data)
			}).then((results) => {
				done()
			})
	})

	/*after(function (done) {
		return cleanUser(user,service)
	})*/
})