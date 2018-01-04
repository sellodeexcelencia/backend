module.exports = {
	MOTIVES: {
		'EVALUATOR': {
			'ACEPTAR_REQUISITO': 'Aceptar Requisito',
			'CALIFICAR_REQUISITO': 'Calificar Requisito',
			'VER_VIDEO': 'Participar en Aprende y Enseña',
			'POSTULARSE_EVALUAR': 'Aceptar Voluntaria',
			'EVENTOS': 'Eventos Especiales',
			'NO_EVALUAR': 'No evaluar',
			'RECHAZAR_REQUISITO': 'Rechazar Requisito'
		},
		'ENTITY': {
			'VER_VIDEO': 'Participar en Aprende y Enseña',
			'EVENTOS': 'Eventos Especiales',
			'POSTULAR_SERVICIO': 'Postular Servicio',
			'POSTULACION_RECHAZADA': 'Postulación Rechazada',
			'CUMPLE': 'Cumplimiento Sello',
			'NO_CUMPLE': 'Incumplimiento Sello',
		}
	},
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
}