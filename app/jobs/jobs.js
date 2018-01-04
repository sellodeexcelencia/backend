let CONSTANTS = require('../events/constants.js')
var config = require('../../config.json')
let HOST = config.hosts[config.enviroment]
let utiles = require('../utils/utiles')
var Jobs = function () {
	let model_entity_evalution_request = require('../models/entity_evaluation_request.js')
	model_entity_evalution_request = new model_entity_evalution_request()
	let model_entity_service = require('../models/entity_service.js')
	model_entity_service = new model_entity_service()
	let model_user = require('../models/user.js')
	model_user = new model_user()
	/**
	 * execute
	 */
	this.execute = function () {
		///RENOVACIÓN
		//servicios que estén en creación y no se hayan postulado alert_time
		let adate = new Date()
		model_entity_service.getByCurrentStatusDate(null, adate, [CONSTANTS.SERVICE.INCOMPLETO])
			.then((results) => {
				results.forEach((service) => {
					let tout = Math.floor(Math.random() * 1000) + 100
					setTimeout(() => {
						utiles.sendEmail(service.user_email, null, null, 'Recordatorio Sello de Excelencia',
							`<div style="text-align:center;margin: 10px auto;">
							<img width="100" src="${HOST}/assets/img/sell_gel.png"/>
							</div>
							<p>Hola ${service.user_name}</p>
							<p>Tienes un servicio pendiente de postulación:</p>
							<p>Nombre del Producto o Servicio: ${service.name}</p>
							<p>Categoría: ${service.category_name}</p>
							<p>Nivel ${service.level}</p>
							<p>Recuerda que puedes terminar la postulación en la plataforma de Sello de Excelencia Gobierno Digital</p>
							<p>Nuestros mejores deseos,<\p>
							<p>El equipo del Sello de Excelencia Gobierno Digital Colombia<\p>`
						)
					}, tout)
				})
			})
		//servicios que estén en otorgado y falten 2 meses para vencer el sello
		adate = new Date()
		adate.setDate(adate.getDate() + 60)
		model_entity_service.getByCurrentStatusDate(adate, null, [CONSTANTS.SERVICE.CUMPLE])
			.then((results) => {
				results.forEach((service) => {
					let tout = Math.floor(Math.random() * 1000) + 100
					setTimeout(() => {
						utiles.sendEmail(service.user_email, null, null, 'Vencimiento Sello de Excelencia Gobierno Digital Colombia',
							`<div style="text-align:center;margin: 10px auto;">
						<img width="100" src="${HOST}/assets/img/sell_gel.png"/>
						</div>
						<p>Hola ${service.user_name}</p>
						<p>El Sello de Excelencia de:</p>
						<p>Nombre del Producto o Servicio: ${service.name}</p>
						<p>Se vence el <b>${service.valid_to.toLocaleString()}</b></p>
						<p>Por favor ingresa a la plataforma para Renovar el Sello de Excelencia Gobierno Digital Colombia en la Pestaña 
						<b>Actividad</b> -> <b>Sellos Otorgados</b> da click en Renovar el Sello.</p>
						<p>Luego debes ir a la pestaña <b>Postular</b> y Seleccionar el Servicio en la sección <b>Continuar con una postulación anterior</b>
						<p>Ten en cuenta que si la renovación no se efectúa antes de la fecha de vencimiento tendrás que hacer todo el proceso de postulación nuevamente</p>
						<p>Nuestros mejores deseos,<\p>
						<p>El equipo del Sello de Excelencia Gobierno Digital Colombia<\p>`
						)
					}, tout)
				})
			})
		//servicios que estén en otorgado y falten 1.5 meses para vencer el sello
		adate = new Date()
		adate.setDate(adate.getDate() + 45)
		model_entity_service.getByCurrentStatusDate(adate, null, [CONSTANTS.SERVICE.CUMPLE])
			.then((results) => {
				results.forEach((service) => {
					let tout = Math.floor(Math.random() * 1000) + 100
					setTimeout(() => {
						utiles.sendEmail(service.user_email, null, null, 'Vencimiento Sello de Excelencia Gobierno Digital Colombia',
							`<div style="text-align:center;margin: 10px auto;">
						<img width="100" src="${HOST}/assets/img/sell_gel.png"/>
						</div>
						<p>Hola ${service.user_name}</p>
						<p>El Sello de Excelencia de:</p>
						<p>Nombre del Producto o Servicio: ${service.name}</p>
						<p>Se vence el <b>${service.valid_to.toLocaleString()}</b></p>
						<p>Por favor ingresa a la plataforma para Renovar el Sello de Excelencia Gobierno Digital Colombia en la Pestaña 
						<b>Actividad</b> -> <b>Sellos Otorgados</b> da click en Renovar el Sello.</p>
						<p>Luego debes ir a la pestaña <b>Postular</b> y Seleccionar el Servicio en la sección <b>Continuar con una postulación anterior</b>
						<p>Ten en cuenta que si la renovación no se efectúa antes de la fecha de vencimiento tendrás que hacer todo el proceso de postulación nuevamente</p>
						<p>Nuestros mejores deseos,<\p>
						<p>El equipo del Sello de Excelencia Gobierno Digital Colombia<\p>`
						)
					}, tout)
				})
			})
		//servicios que estén en otorgado y falten 1 meses para vencer el sello
		adate = new Date()
		adate.setDate(adate.getDate() + 30)
		model_entity_service.getByCurrentStatusDate(adate, null, [CONSTANTS.SERVICE.CUMPLE])
			.then((results) => {
				results.forEach((service) => {
					let tout = Math.floor(Math.random() * 1000) + 100
					setTimeout(() => {
						utiles.sendEmail(service.user_email, null, null, 'Vencimiento Sello de Excelencia Gobierno Digital Colombia',
							`<div style="text-align:center;margin: 10px auto;">
						<img width="100" src="${HOST}/assets/img/sell_gel.png"/>
						</div>
						<p>Hola ${service.user_name}</p>
						<p>El Sello de Excelencia de:</p>
						<p>Nombre del Producto o Servicio: ${service.name}</p>
						<p>Se vence el <b>${service.valid_to.toLocaleString()}</b></p>
						<p>Por favor ingresa a la plataforma para Renovar el Sello de Excelencia Gobierno Digital Colombia en la Pestaña 
						<b>Actividad</b> -> <b>Sellos Otorgados</b> da click en Renovar el Sello.</p>
						<p>Luego debes ir a la pestaña <b>Postular</b> y Seleccionar el Servicio en la sección <b>Continuar con una postulación anterior</b>
						<p>Ten en cuenta que si la renovación no se efectúa antes de la fecha de vencimiento tendrás que hacer todo el proceso de postulación nuevamente</p>
						<p>Nuestros mejores deseos,<\p>
						<p>El equipo del Sello de Excelencia Gobierno Digital Colombia<\p>`
						)
					}, tout)
				})
			})
		//servicios que estén en otorgado y falten .5 meses para vencer el sello
		adate = new Date()
		adate.setDate(adate.getDate() + 15)
		model_entity_service.getByCurrentStatusDate(adate, null, [CONSTANTS.SERVICE.CUMPLE])
			.then((results) => {
				results.forEach((service) => {
					let tout = Math.floor(Math.random() * 1000) + 100
					setTimeout(() => {
						utiles.sendEmail(service.user_email, null, null, 'Vencimiento Sello de Excelencia Gobierno Digital Colombia',
							`<div style="text-align:center;margin: 10px auto;">
						<img width="100" src="${HOST}/assets/img/sell_gel.png"/>
						</div>
						<p>Hola ${service.user_name}</p>
						<p>El Sello de Excelencia de:</p>
						<p>Nombre del Producto o Servicio: ${service.name}</p>
						<p>Se vence el <b>${service.valid_to.toLocaleString()}</b></p>
						<p>Por favor ingresa a la plataforma para Renovar el Sello de Excelencia Gobierno Digital Colombia en la Pestaña 
						<b>Actividad</b> -> <b>Sellos Otorgados</b> da click en Renovar el Sello.</p>
						<p>Luego debes ir a la pestaña <b>Postular</b> y Seleccionar el Servicio en la sección <b>Continuar con una postulación anterior</b>
						<p>Ten en cuenta que si la renovación no se efectúa antes de la fecha de vencimiento tendrás que hacer todo el proceso de postulación nuevamente</p>
						<p>Nuestros mejores deseos,<\p>
						<p>El equipo del Sello de Excelencia Gobierno Digital Colombia<\p>`
						)
					}, tout)
				})
			})
		//servicios deshabilitados
		adate = new Date()
		model_entity_service.getByCurrentStatusDate(adate, null, [CONSTANTS.SERVICE.CUMPLE])
			.then((results) => {
				results.forEach((service) => {
					let tout = Math.floor(Math.random() * 1000) + 100
					setTimeout(() => {
						utiles.sendEmail(service.user_email, null, null, 'Vencimiento Sello de Excelencia Gobierno Digital Colombia',
							`<div style="text-align:center;margin: 10px auto;">
						<img width="100" src="${HOST}/assets/img/sell_gel.png"/>
						</div>
						<p>Hola ${service.user_name}</p>
						<p>El Sello de Excelencia de:</p>
						<p>Nombre del Producto o Servicio: ${service.name}</p>
						<p>Se vence el <b>${service.valid_to.toLocaleString()}</b></p>
						<p>Por favor ingresa a la plataforma para Renovar el Sello de Excelencia Gobierno Digital Colombia en la Pestaña 
						<b>Actividad</b> -> <b>Sellos Otorgados</b> da click en Renovar el Sello.</p>
						<p>Luego debes ir a la pestaña <b>Postular</b> y Seleccionar el Servicio en la sección <b>Continuar con una postulación anterior</b>
						<p>Ten en cuenta que si la renovación no se efectúa antes de la fecha de vencimiento tendrás que hacer todo el proceso de postulación nuevamente</p>
						<p>Nuestros mejores deseos,<\p>
						<p>El equipo del Sello de Excelencia Gobierno Digital Colombia<\p>`
						)
					}, tout)
				})
			})
		//solicitudes de evaluación que estén en alert_time y no estén en cumple / no_cumple
		adate = new Date()
		model_entity_evalution_request.getByStatusDate(null, adate,
			[CONSTANTS.EVALUATION_REQUEST.ACEPTADO,
			CONSTANTS.EVALUATION_REQUEST.SOLICITADO,
			CONSTANTS.EVALUATION_REQUEST.RETROALIMENTACION,
			CONSTANTS.EVALUATION_REQUEST.ASIGNADO])
			.then((results) => {
				results.forEach((request) => {
					let tout = Math.floor(Math.random() * 1000) + 100
					setTimeout(() => {
						utiles.sendEmail(request.user_email, null, null, 'Vencimiento de Evaluación - Sello de Excelencia Gobierno Digital Colombia',
							`<div style="text-align:center;margin: 10px auto;">
								<img width="100" src="${HOST}/assets/img/sell_gel.png"/>
								</div>
								<p>Hola ${request.user_name}</p>
								<p>El plazo de evaluación del siguiente requisito:</p>
								<p>Categoría: ${request.category_name}</p>
								<p>Nivel: ${request.level}</p>
								<p>Temática: ${request.topic}</p>
								<p>Requisito: ${request.question}</p>
								<p>Entidad: ${request.institution}</p>
								<p>Nombre del Producto o Servicio: ${request.service_name}</p>
								<p>Está próximo a vencerse <b>${request.end_time.toLocaleString()}</b></p>
								<p>Por favor ingresa a la plataforma para Evaluar el Requisito.</p>
								<p>Nuestros mejores deseos,<\p>
								<p>El equipo del Sello de Excelencia Gobierno Digital Colombia<\p>`
						)
					}, tout)
				})
			})
		//reasignar solicitudes con valid_to = hoy 
		let _admin = null
		return model_user.getAdmin().then((result)=>{
			_admin = result[0]
			return model_entity_evalution_request.getByStatusDate(adate, null,
				[CONSTANTS.EVALUATION_REQUEST.ACEPTADO,
				CONSTANTS.EVALUATION_REQUEST.SOLICITADO,
				CONSTANTS.EVALUATION_REQUEST.RETROALIMENTACION,
				CONSTANTS.EVALUATION_REQUEST.ASIGNADO])
		})
		.then((results)=>{
			results.forEach((request) => {
				model_entity_evalution_request.update({id_user:_admin.id},{id:request.id})
				let tout = Math.floor(Math.random() * 1000) + 100
				setTimeout(() => {
					utiles.sendEmail(request.user_email, null, null, 'Asignación por Vencimiento de Evaluación - Sello de Excelencia Gobierno Digital Colombia',
						`<div style="text-align:center;margin: 10px auto;">
							<img width="100" src="${HOST}/assets/img/sell_gel.png"/>
							</div>
							<p>Hola ${_admin.name}</p>
							<p>El plazo de evaluación del siguiente requisito:</p>
							<p>Categoría: ${request.category_name}</p>
							<p>Nivel: ${request.level}</p>
							<p>Temática: ${request.topic}</p>
							<p>Requisito: ${request.question}</p>
							<p>Entidad: ${request.institution}</p>
							<p>Nombre del Producto o Servicio: ${request.service_name}</p>
							<p>Se ha vencido</p>
							<p>Por favor ingresa a la plataforma para Evaluar el Requisito.</p>
							<p>Nuestros mejores deseos,<\p>
							<p>El equipo del Sello de Excelencia Gobierno Digital Colombia<\p>`
					)
				}, tout)
			})
		})
	}

	this.info = function(){
		let adate = new Date()
		return model_entity_service.getByCurrentStatusDate(null, null, [CONSTANTS.SERVICE.INCOMPLETO])
	}
}
module.exports = Jobs