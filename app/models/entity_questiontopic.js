/**  * ENTITY AUTO_GENERATED BY DMT-GENERATOR
 * {{ENTITY_NAME}}
 * DMT 2017
 * GENERATED: 5 / 9 / 2017 - 7:39:27
 **/
var BaseModel = require('../utils/model.js')
var util = require('util')
var Questiontopic = function () {
	var params = [{"table":"questiontopic","relations":[{"type":"1-1","name":"user_type","entity":"usertype","leftKey":"id_usertype","foreign_name":"name"},{"type":"1-1","name":"category","entity":"category","leftKey":"id_category","foreign_name":"name"}],"entity":"questiontopic","model":"entity"}]
	BaseModel.apply(this, params)
	return this
};
util.inherits(Questiontopic, BaseModel)
module.exports = Questiontopic