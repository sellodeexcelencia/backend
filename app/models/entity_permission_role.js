/**  * ENTITY AUTO_GENERATED BY DMT-GENERATOR
 * {{ENTITY_NAME}}
 * DMT 2017
 * GENERATED: 5 / 9 / 2017 - 7:38:21
 **/
var BaseModel = require('../utils/model.js')
var util = require('util')
var Permission_role = function () {
	var params = [{"table":"permission_role","relations":[{"type":"1-1","name":"permission","entity":"permission","leftKey":"id_permission","foreign_name":"name"},{"type":"1-1","name":"role","entity":"role","leftKey":"id_role","foreign_name":"name"}],"entity":"permission_role","model":"entity"}]
	BaseModel.apply(this, params)
	return this
};
util.inherits(Permission_role, BaseModel)
module.exports = Permission_role