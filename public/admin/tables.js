if(!dmt){
	var dmt = {}
}
dmt.tables = {
	"city": {
		"fields": [
			{
				"name": "id",
				"type": "int",
				"disabled": true,
				"key": true
			},
			{
				"name": "name",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "code",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "latitude",
				"type": "number",
				"disabled": false,
				"key": false
			},
			{
				"name": "longitude",
				"type": "number",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_region",
				"type": "int",
				"disabled": false,
				"key": false
			}
		],
		"defaultSort": "id"
	},
	"hangouts": {
		"fields": [
			{
				"name": "id",
				"type": "int",
				"disabled": true,
				"key": true
			},
			{
				"name": "title",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "image",
				"type": "file",
				"disabled": false,
				"key": false
			},
			{
				"name": "url",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "description",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_role",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "activation_date",
				"type": "datetime",
				"disabled": false,
				"key": false
			},
			{
				"name": "active",
				"type": "boolean",
				"disabled": false,
				"key": false
			}
		],
		"defaultSort": "id"
	},
	"footer": {
		"fields": [
			{
				"name": "id",
				"type": "int",
				"disabled": true,
				"key": true
			},
			{
				"name": "title",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "text",
				"type": "text",
				"disabled": false,
				"key": false
			}
		],
		"defaultSort": "id"
	},
	"request_status": {
		"fields": [
			{
				"name": "id",
				"type": "int",
				"disabled": true,
				"key": true
			},
			{
				"name": "name",
				"type": "string",
				"disabled": true,
				"key": false
			},
			{
				"name": "duration",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "pre_end",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "alert",
				"type": "boolean",
				"disabled": false,
				"key": false
			},
			{
				"name": "description",
				"type": "text",
				"disabled": false,
				"key": false
			}
		],
		"defaultSort": "id"
	},
	"category": {
		"fields": [
			{
				"name": "id",
				"type": "int",
				"disabled": true,
				"key": true
			},
			{
				"name": "name",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "diploma",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "validity",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "active",
				"type": "boolean",
				"disabled": false,
				"key": false
			},
		],
		"defaultSort": "id"
	},
	"form": {
		"fields": [
			{
				"name": "id",
				"type": "int",
				"disabled": true,
				"key": true
			},
			{
				"name": "name",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_category",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "timestamp",
				"type": "datetime",
				"disabled": true,
				"key": false
			}
		],
		"defaultSort": "id"
	},
	"institution": {
		"fields": [
			{
				"name": "id",
				"type": "int",
				"disabled": true,
				"key": true
			},
			{
				"name": "name",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_institution_type",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_city",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "active",
				"type": "boolean",
				"disabled": false,
				"key": false
			},
			{
				"name": "nit",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "website",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "address",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "email",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "phone",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "extension_phone",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_region",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_country",
				"type": "int",
				"disabled": false,
				"key": false
			},
			
			{
				"name": "timestamp",
				"type": "datetime",
				"disabled": true,
				"key": false
			}
		],
		"defaultSort": "id"
	},
	"questiontopic": {
		"fields": [
			{
				"name": "id",
				"type": "int",
				"disabled": true,
				"key": true
			},
			{
				"name": "name",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "description",
				"type": "text",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_usertype",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_category",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "active",
				"type": "boolean",
				"disabled": false,
				"key": false
			}
		],
		"defaultSort": "id"
	},
	"evaluation_request": {
		"fields": [
			{
				"name": "id",
				"type": "int",
				"disabled": true,
				"key": true
			},
			{
				"name": "id_user",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_answer",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_service",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_request_status",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_question",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "timestamp",
				"type": "datetime",
				"disabled": true,
				"key": false
			},
			{
				"name": "result",
				"type": "boolean",
				"disabled": false,
				"key": false
			},
			{
				"name": "branch",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "justify_reject",
				"type": "text",
				"disabled": false,
				"key": false
			},
			{
				"name": "alert_time",
				"type": "datetime",
				"disabled": true,
				"key": false
			},
			{
				"name": "end_time",
				"type": "datetime",
				"disabled": true,
				"key": false
			}
		],
		"defaultSort": "id"
	},
	"category_questions": {
		"fields": [
			{
				"name": "id",
				"type": "int",
				"disabled": true,
				"key": true
			},
			{
				"name": "id_category",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "text",
				"type": "text",
				"disabled": false,
				"key": false
			},
			{
				"name": "active",
				"type": "boolean",
				"disabled": false,
				"key": false
			}
		],
		"defaultSort": "id"
	},
	"availability": {
		"fields": [
			{
				"name": "id",
				"type": "int",
				"disabled": true,
				"key": true
			},
			{
				"name": "name",
				"type": "string",
				"disabled": false,
				"key": false
			}
		],
		"defaultSort": "id"
	},
	"chats": {
		"fields": [
			{
				"name": "id",
				"type": "int",
				"disabled": true,
				"key": true
			},
			{
				"name": "id_evaluation_request",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_sender",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "text",
				"type": "text",
				"disabled": false,
				"key": false
			},
			{
				"name": "timestamp",
				"type": "datetime",
				"disabled": true,
				"key": false
			}
		],
		"defaultSort": "id"
	},
	"message": {
		"fields": [
			{
				"name": "id",
				"type": "int",
				"disabled": true,
				"key": true
			},
			{
				"name": "text",
				"type": "text",
				"disabled": false,
				"key": false
			},
			{
				"name": "url",
				"type": "text",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_topic",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_user",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "timestamp",
				"type": "datetime",
				"disabled": true,
				"key": false
			}
		],
		"defaultSort": "id"
	},
	"service": {
		"fields": [
			{
				"name": "id",
				"type": "int",
				"disabled": true,
				"key": true
			},
			{
				"name": "name",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_category",
				"type": "int",
				"disabled": true,
				"key": false
			},
			{
				"name": "current_status",
				"type": "int",
				"disabled": true,
				"key": false
			},
			{
				"name": "level",
				"type": "int",
				"disabled": true,
				"key": false
			},
			{
				"name": "rate",
				"type": "number",
				"disabled": true,
				"key": false
			},
			{
				"name": "url",
				"type": "text",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_institution",
				"type": "int",
				"disabled": true,
				"key": false
			},
			{
				"name": "test_user",
				"type": "string",
				"disabled": true,
				"key": false
			},
			{
				"name": "test_password",
				"type": "string",
				"disabled": true,
				"key": false
			},
			{
				"name": "is_active",
				"type": "boolean",
				"disabled": false,
				"key": false
			},
			{
				"name": "timestamp",
				"type": "datetime",
				"disabled": true,
				"key": false
			},
			
			{
				"name": "id_user",
				"type": "int",
				"disabled": true,
				"key": false
			},
		],
		"defaultSort": "id"
	},
	"usertype": {
		"fields": [
			{
				"name": "id",
				"type": "int",
				"disabled": true,
				"key": true
			},
			{
				"name": "name",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "description",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "active",
				"type": "boolean",
				"disabled": false,
				"key": false
			}
		],
		"defaultSort": "id"
	},
	"status": {
		"fields": [
			{
				"name": "id",
				"type": "int",
				"disabled": true,
				"key": true
			},
			{
				"name": "name",
				"type": "string",
				"disabled": true,
				"key": false
			},
			{
				"name": "duration",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "pre_end",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "alert",
				"type": "boolean",
				"disabled": false,
				"key": false
			},
			{
				"name": "description",
				"type": "text",
				"disabled": false,
				"key": false
			}
		],
		"defaultSort": "id"
	},
	"region": {
		"fields": [
			{
				"name": "id",
				"type": "int",
				"disabled": true,
				"key": true
			},
			{
				"name": "name",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_capital",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_country",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "code",
				"type": "string",
				"disabled": false,
				"key": false
			}
		],
		"defaultSort": "id"
	},
	"hall_of_fame": {
		"fields": [
			{
				"name": "id",
				"type": "int",
				"disabled": true,
				"key": true
			},
			{
				"name": "ranking",
				"type": "int",
				"disabled": true,
				"key": true
			},
			{
				"name": "name",
				"type": "text",
				"disabled": false,
				"key": false
			},
			{
				"name": "points",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "date",
				"type": "datetime",
				"disabled": true,
				"key": false
			},
			{
				"name": "id_role",
				"type": "int",
				"disabled": false,
				"key": false
			}
		],
		"defaultSort": "id"
	},
	"type": {
		"fields": [
			{
				"name": "id",
				"type": "int",
				"disabled": true,
				"key": true
			},
			{
				"name": "name",
				"type": "string",
				"disabled": false,
				"key": false
			}
		],
		"defaultSort": "id"
	},
	"permission": {
		"fields": [
			{
				"name": "id",
				"type": "int",
				"disabled": true,
				"key": true
			},
			{
				"name": "name",
				"type": "string",
				"disabled": false,
				"key": false
			}
		],
		"defaultSort": "id"
	},
	"banner": {
		"fields": [
			{
				"name": "id",
				"type": "int",
				"disabled": true,
				"key": true
			},
			{
				"name": "position",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "title",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "summary",
				"type": "text",
				"disabled": false,
				"key": false
			},
			{
				"name": "video",
				"type": "file",
				"disabled": false,
				"key": false
			},

			{
				"name": "text",
				"type": "text",
				"disabled": false,
				"key": false
			},
			{
				"name": "background",
				"type": "file",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_type_banner",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "active",
				"type": "boolean",
				"disabled": false,
				"key": false
			},
			{
				"name": "timestamp",
				"type": "datetime",
				"disabled": true,
				"key": false
			}
		],
		"defaultSort": "id"
	},
	"contact": {
		"fields": [
			{
				"name": "id",
				"type": "int",
				"disabled": true,
				"key": true
			},
			{
				"name": "name",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "lastname",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "topic",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "message",
				"type": "text",
				"disabled": false,
				"key": false
			},
			{
				"name": "timestamp",
				"type": "datetime",
				"disabled": true,
				"key": false
			}
		],
		"defaultSort": "id"
	},
	"user_answer": {
		"fields": [
			{
				"name": "id",
				"type": "int",
				"disabled": true,
				"key": true
			},
			{
				"name": "id_order",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_user",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_service",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_question",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_topic",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_status",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_media",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "datetime",
				"type": "datetime",
				"disabled": true,
				"key": false
			},
			{
				"name": "timestamp",
				"type": "datetime",
				"disabled": true,
				"key": false
			},
			{
				"name": "comment",
				"type": "text",
				"disabled": false,
				"key": false
			},
			{
				"name": "alert",
				"type": "boolean",
				"disabled": false,
				"key": false
			}
		],
		"defaultSort": "id"
	},
	"role": {
		"fields": [
			{
				"name": "id",
				"type": "int",
				"disabled": true,
				"key": true
			},
			{
				"name": "name",
				"type": "string",
				"disabled": false,
				"key": false
			}
		],
		"defaultSort": "id"
	},
	"config": {
		"fields": [
			{
				"name": "id",
				"type": "int",
				"disabled": true,
				"key": true
			},
			{
				"name": "header",
				"type": "file",
				"disabled": false,
				"key": false
			},
			{
				"name": "footer",
				"type": "file",
				"disabled": false,
				"key": false
			}
		],
		"defaultSort": "id"
	},
	"institution_user": {
		"fields": [
			{
				"name": "id_institution",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_user",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "role",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "admin",
				"type": "boolean",
				"disabled": false,
				"key": false
			},
			{
				"name": "certificate",
				"type": "text",
				"disabled": false,
				"key": false
			}
		],
		"defaultSort": "id_institution"
	},
	"user_category": {
		"fields": [
			{
				"name": "id_user",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_category",
				"type": "int",
				"disabled": false,
				"key": false
			}
		],
		"defaultSort": "id_user"
	},
	"country": {
		"fields": [
			{
				"name": "id",
				"type": "int",
				"disabled": true,
				"key": true
			},
			{
				"name": "name",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "nacionalidad",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_capital",
				"type": "int",
				"disabled": false,
				"key": false
			}
		],
		"defaultSort": "id"
	},
	"type_banner": {
		"fields": [
			{
				"name": "id",
				"type": "int",
				"disabled": true,
				"key": true
			},
			{
				"name": "name",
				"type": "string",
				"disabled": false,
				"key": false
			}
		],
		"defaultSort": "id"
	},
	"session": {
		"fields": [
			{
				"name": "id_user",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "agent",
				"type": "text",
				"disabled": false,
				"key": false
			},
			{
				"name": "ip",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "token",
				"type": "text",
				"disabled": false,
				"key": false
			},
			{
				"name": "expires",
				"type": "date",
				"disabled": false,
				"key": false
			}
		],
		"defaultSort": "id_user"
	},
	"institutionType": {
		"fields": [
			{
				"name": "id",
				"type": "int",
				"disabled": true,
				"key": true
			},
			{
				"name": "name",
				"type": "string",
				"disabled": false,
				"key": false
			}
		],
		"defaultSort": "id"
	},
	"user_role": {
		"fields": [
			{
				"name": "id_user",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_role",
				"type": "int",
				"disabled": false,
				"key": false
			}
		],
		"defaultSort": "id_user"
	},
	"media": {
		"fields": [
			{
				"name": "id",
				"type": "int",
				"disabled": true,
				"key": true
			},
			{
				"name": "url",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "type",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "timestamp",
				"type": "datetime",
				"disabled": true,
				"key": false
			}
		],
		"defaultSort": "id"
	},
	"message_media": {
		"fields": [
			{
				"name": "id_media",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_message",
				"type": "int",
				"disabled": false,
				"key": false
			}
		],
		"defaultSort": "id_media"
	},
	"social": {
		"fields": [
			{
				"name": "id",
				"type": "int",
				"disabled": true,
				"key": true
			},
			{
				"name": "name",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "icon",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "link",
				"type": "string",
				"disabled": false,
				"key": false
			}
		],
		"defaultSort": "id"
	},
	"motives": {
		"fields": [
			
			{
				"name": "id_name",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_category",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "level",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_role",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "points",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "public",
				"type": "boolean",
				"disabled": false,
				"key": false
			},
			{
				"name": "description",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "id",
				"type": "int",
				"disabled": true,
				"key": true
			},
		],
		"defaultSort": "id"
	},
	"motivename": {
		"fields": [
			{
				"name": "id",
				"type": "int",
				"disabled": true,
				"key": true
			},
			{
				"name": "name",
				"type": "string",
				"disabled": false,
				"key": false
			},
		],
		"defaultSort": "id"
	},
	"service_comment": {
		"fields": [
			{
				"name": "id",
				"type": "int",
				"disabled": true,
				"key": true
			},
			{
				"name": "id_service",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_user",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "text",
				"type": "text",
				"disabled": false,
				"key": false
			},
			{
				"name": "rate",
				"type": "number",
				"disabled": false,
				"key": false
			},
			{
				"name": "timestamp",
				"type": "datetime",
				"disabled": true,
				"key": false
			}
		],
		"defaultSort": "id"
	},
	"points": {
		"fields": [
			{
				"name": "id",
				"type": "int",
				"disabled": true,
				"key": true
			},
			{
				"name": "prev_points",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "value",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "result",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "justification",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_user",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_motives",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_hangout",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_institution",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "timestamp",
				"type": "datetime",
				"disabled": false,
				"key": false
			}
		],
		"defaultSort": "id"
	},
	"topic": {
		"fields": [
			{
				"name": "id",
				"type": "int",
				"disabled": true,
				"key": true
			},
			{
				"name": "name",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_parent",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "private",
				"type": "boolean",
				"disabled": false,
				"key": false
			},
			{
				"name": "timestamp",
				"type": "datetime",
				"disabled": true,
				"key": false
			}
		],
		"defaultSort": "id"
	},
	"user_questiontopic": {
		"fields": [
			{
				"name": "id_user",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_topic",
				"type": "int",
				"disabled": false,
				"key": false
			}
		],
		"defaultSort": "id_user"
	},
	"faq": {
		"fields": [
			{
				"name": "id",
				"type": "int",
				"disabled": true,
				"key": true
			},
			{
				"name": "question",
				"type": "text",
				"disabled": false,
				"key": false
			},
			{
				"name": "answer",
				"type": "text",
				"disabled": false,
				"key": false
			},
			{
				"name": "active",
				"type": "boolean",
				"disabled": false,
				"key": false
			},
			{
				"name": "timestamp",
				"type": "datetime",
				"disabled": true,
				"key": false
			}
		],
		"defaultSort": "id"
	},
	"service_status": {
		"fields": [
			{
				"name": "id",
				"type": "int",
				"disabled": false,
				"key": true
			},
			{
				"name": "id_service",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_status",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "level",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "valid_to",
				"type": "datetime",
				"disabled": true,
				"key": false
			},
			{
				"name": "timestamp",
				"type": "datetime",
				"disabled": true,
				"key": false
			}
		],
		"defaultSort": "id_service"
	},
	"user": {
		"fields": [
			{
				"name": "id",
				"type": "int",
				"disabled": true,
				"key": true
			},
			{
				"name": "name",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "secondname",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "lastname",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "secondlastname",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "email",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "phone",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "extension",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "mobile",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "organization",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "ocupation",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "education_level",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "password",
				"type": "text",
				"disabled": false,
				"key": false
			},
			{
				"name": "tmp_pwd",
				"type": "boolean",
				"disabled": false,
				"key": false
			},
			{
				"name": "points",
				"type": "int",
				"disabled": true,
				"key": false
			},
			{
				"name": "active",
				"type": "boolean",
				"disabled": false,
				"key": false
			},
			{
				"name": "terms",
				"type": "boolean",
				"disabled": false,
				"key": false
			},
			{
				"name": "timestamp",
				"type": "datetime",
				"disabled": true,
				"key": false
			},
			{
				"name": "id_availability",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_city",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_region",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_country",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "document",
				"type": "string",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_type_document",
				"type": "int",
				"disabled": false,
				"key": false
			}
		],
		"defaultSort": "id"
	},
	"permission_role": {
		"fields": [
			{
				"name": "id_role",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_permission",
				"type": "int",
				"disabled": false,
				"key": false
			}
		],
		"defaultSort": "id_role"
	},
	"message_votes": {
		"fields": [
			{
				"name": "id",
				"type": "int",
				"disabled": true,
				"key": true
			},
			{
				"name": "id_user",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "id_message",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "timestamp",
				"type": "datetime",
				"disabled": true,
				"key": false
			}
		],
		"defaultSort": "id"
	},
	"type_document": {
		"fields": [
			{
				"name": "id",
				"type": "int",
				"disabled": true,
				"key": true
			},
			{
				"name": "name",
				"type": "string",
				"disabled": false,
				"key": false
			}
		],
		"defaultSort": "id"
	},
	"question": {
		"fields": [
			{
				"name": "id",
				"type": "int",
				"disabled": true,
				"key": true
			},
			{
				"name": "id_topic",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "level",
				"type": "int",
				"disabled": false,
				"key": false
			},
			{
				"name": "text",
				"type": "text",
				"disabled": false,
				"key": false
			},
			{
				"name": "active",
				"type": "boolean",
				"disabled": false,
				"key": false
			},
			{
				"name": "criteria",
				"type": "text",
				"disabled": false,
				"key": false
			},
			{
				"name": "evidence",
				"type": "text",
				"disabled": false,
				"key": false
			},
			{
				"name": "legal_support",
				"type": "text",
				"disabled": false,
				"key": false
			},
			{
				"name": "help",
				"type": "text",
				"disabled": false,
				"key": false
			}
		],
		"defaultSort": "id"
	}
};
try {
	module.exports = dmt;
} catch (e) {
	console.log(e);
}
