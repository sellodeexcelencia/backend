/**  * MODEL AUTO_GENERATED BY DMT-GENERATOR
 * user_category
 * [{"Field":"id_user","Type":"int(11)","Null":"YES","Key":"MUL","Default":null,"Extra":""},{"Field":"id_category","Type":"int(11)","Null":"YES","Key":"MUL","Default":null,"Extra":""}]
 * DMT 2017
 * GENERATED: 5 / 9 / 2017 - 7:38:21
 **/
var BaseModel = require('../utils/model.js')
var util = require('util')
var User_category = function () {
	var params = [{
		table:'user_category',
		fields :[{"Field":"id_user","Type":"int(11)","Null":"YES","Key":"MUL","Default":null,"Extra":""},{"Field":"id_category","Type":"int(11)","Null":"YES","Key":"MUL","Default":null,"Extra":""}],
		model:'mysql'
	}]
	BaseModel.apply(this, params)
	return this
};
util.inherits(User_category, BaseModel)
module.exports = User_category