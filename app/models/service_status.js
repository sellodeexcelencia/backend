/**  * MODEL AUTO_GENERATED BY DMT-GENERATOR
 * service_status
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
		"Field": "id_service",
		"Type": "int(11)",
		"Null": "YES",
		"Key": "MUL",
		"Default": null,
		"Extra": ""
	},
	{
		"Field": "id_status",
		"Type": "int(11)",
		"Null": "YES",
		"Key": "MUL",
		"Default": null,
		"Extra": ""
	},
	{
		"Field": "level",
		"Type": "tinyint(4)",
		"Null": "YES",
		"Key": "",
		"Default": null,
		"Extra": ""
	},
	{
		"Field": "valid_to",
		"Type": "timestamp",
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
		"Field": "alarm",
		"Type": "timestamp",
		"Null": "YES",
		"Key": "",
		"Default": null,
		"Extra": ""
	}
]
 * DMT 2017
 * GENERATED: 24 / 11 / 2017 - 12:39:35
 **/
var BaseModel = require('../utils/model.js')
var util = require('util')
var Service_status = function () {
	var params = [{
		table:'service_status',
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
		"Field": "id_service",
		"Type": "int(11)",
		"Null": "YES",
		"Key": "MUL",
		"Default": null,
		"Extra": ""
	},
	{
		"Field": "id_status",
		"Type": "int(11)",
		"Null": "YES",
		"Key": "MUL",
		"Default": null,
		"Extra": ""
	},
	{
		"Field": "level",
		"Type": "tinyint(4)",
		"Null": "YES",
		"Key": "",
		"Default": null,
		"Extra": ""
	},
	{
		"Field": "valid_to",
		"Type": "timestamp",
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
		"Field": "alarm",
		"Type": "timestamp",
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
util.inherits(Service_status, BaseModel)
module.exports = Service_status