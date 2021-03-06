/**  * MODEL AUTO_GENERATED BY DMT-GENERATOR
 * service
 * [
	{
		"Field": "id",
		"Type": "int(11)",
		"Null": "NO",
		"Key": "PRI",
		"Default": null,
		"Extra": "auto_increment"
	},
	{
		"Field": "name",
		"Type": "varchar(255)",
		"Null": "YES",
		"Key": "",
		"Default": null,
		"Extra": ""
	},
	{
		"Field": "url",
		"Type": "text",
		"Null": "YES",
		"Key": "",
		"Default": null,
		"Extra": ""
	},
	{
		"Field": "id_category",
		"Type": "int(11)",
		"Null": "YES",
		"Key": "MUL",
		"Default": null,
		"Extra": ""
	},
	{
		"Field": "id_institution",
		"Type": "int(11)",
		"Null": "YES",
		"Key": "MUL",
		"Default": null,
		"Extra": ""
	},
	{
		"Field": "id_user",
		"Type": "int(11)",
		"Null": "YES",
		"Key": "MUL",
		"Default": null,
		"Extra": ""
	},
	{
		"Field": "hash",
		"Type": "varchar(255)",
		"Null": "YES",
		"Key": "",
		"Default": null,
		"Extra": ""
	},
	{
		"Field": "rate",
		"Type": "float(4,3)",
		"Null": "NO",
		"Key": "",
		"Default": "0.000",
		"Extra": ""
	},
	{
		"Field": "test_user",
		"Type": "varchar(255)",
		"Null": "YES",
		"Key": "",
		"Default": null,
		"Extra": ""
	},
	{
		"Field": "test_password",
		"Type": "varchar(255)",
		"Null": "YES",
		"Key": "",
		"Default": null,
		"Extra": ""
	},
	{
		"Field": "is_active",
		"Type": "tinyint(1)",
		"Null": "YES",
		"Key": "",
		"Default": null,
		"Extra": ""
	},
	{
		"Field": "is_product",
		"Type": "tinyint(1)",
		"Null": "YES",
		"Key": "",
		"Default": null,
		"Extra": ""
	},
	{
		"Field": "is_service",
		"Type": "tinyint(1)",
		"Null": "YES",
		"Key": "",
		"Default": null,
		"Extra": ""
	},
	{
		"Field": "timestamp",
		"Type": "timestamp",
		"Null": "NO",
		"Key": "",
		"Default": "CURRENT_TIMESTAMP",
		"Extra": ""
	},
	{
		"Field": "current_status",
		"Type": "int(11)",
		"Null": "YES",
		"Key": "MUL",
		"Default": null,
		"Extra": ""
	},
	{
		"Field": "level",
		"Type": "int(11)",
		"Null": "YES",
		"Key": "",
		"Default": "1",
		"Extra": ""
	},
	{
		"Field": "datetime",
		"Type": "int(11)",
		"Null": "YES",
		"Key": "",
		"Default": null,
		"Extra": ""
	}
]
 * DMT 2017
 * GENERATED: 5 / 11 / 2017 - 1:30:27
 **/
var BaseModel = require('../utils/model.js')
var util = require('util')
var Service = function () {
	var params = [{
		table:'service',
		fields :[
	{
		"Field": "id",
		"Type": "int(11)",
		"Null": "NO",
		"Key": "PRI",
		"Default": null,
		"Extra": "auto_increment"
	},
	{
		"Field": "name",
		"Type": "varchar(255)",
		"Null": "YES",
		"Key": "",
		"Default": null,
		"Extra": ""
	},
	{
		"Field": "url",
		"Type": "text",
		"Null": "YES",
		"Key": "",
		"Default": null,
		"Extra": ""
	},
	{
		"Field": "id_category",
		"Type": "int(11)",
		"Null": "YES",
		"Key": "MUL",
		"Default": null,
		"Extra": ""
	},
	{
		"Field": "id_institution",
		"Type": "int(11)",
		"Null": "YES",
		"Key": "MUL",
		"Default": null,
		"Extra": ""
	},
	{
		"Field": "id_user",
		"Type": "int(11)",
		"Null": "YES",
		"Key": "MUL",
		"Default": null,
		"Extra": ""
	},
	{
		"Field": "hash",
		"Type": "varchar(255)",
		"Null": "YES",
		"Key": "",
		"Default": null,
		"Extra": ""
	},
	{
		"Field": "rate",
		"Type": "float(4,3)",
		"Null": "NO",
		"Key": "",
		"Default": "0.000",
		"Extra": ""
	},
	{
		"Field": "test_user",
		"Type": "varchar(255)",
		"Null": "YES",
		"Key": "",
		"Default": null,
		"Extra": ""
	},
	{
		"Field": "test_password",
		"Type": "varchar(255)",
		"Null": "YES",
		"Key": "",
		"Default": null,
		"Extra": ""
	},
	{
		"Field": "is_active",
		"Type": "tinyint(1)",
		"Null": "YES",
		"Key": "",
		"Default": null,
		"Extra": ""
	},
	{
		"Field": "is_product",
		"Type": "tinyint(1)",
		"Null": "YES",
		"Key": "",
		"Default": null,
		"Extra": ""
	},
	{
		"Field": "is_service",
		"Type": "tinyint(1)",
		"Null": "YES",
		"Key": "",
		"Default": null,
		"Extra": ""
	},
	{
		"Field": "timestamp",
		"Type": "timestamp",
		"Null": "NO",
		"Key": "",
		"Default": "CURRENT_TIMESTAMP",
		"Extra": ""
	},
	{
		"Field": "current_status",
		"Type": "int(11)",
		"Null": "YES",
		"Key": "MUL",
		"Default": null,
		"Extra": ""
	},
	{
		"Field": "level",
		"Type": "int(11)",
		"Null": "YES",
		"Key": "",
		"Default": "1",
		"Extra": ""
	},
	{
		"Field": "datetime",
		"Type": "int(11)",
		"Null": "YES",
		"Key": "",
		"Default": null,
		"Extra": ""
	}
],
		model:'mysql'
	}]
	BaseModel.apply(this, params)
	return this
};
util.inherits(Service, BaseModel)
module.exports = Service