/**  * MODEL AUTO_GENERATED BY DMT-GENERATOR
 * faq
 * [{"Field":"id","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"},{"Field":"question","Type":"text","Null":"YES","Key":"","Default":null,"Extra":""},{"Field":"answer","Type":"text","Null":"YES","Key":"","Default":null,"Extra":""},{"Field":"active","Type":"tinyint(1)","Null":"YES","Key":"","Default":null,"Extra":""},{"Field":"timestamp","Type":"timestamp","Null":"NO","Key":"","Default":"CURRENT_TIMESTAMP","Extra":""}]
 * DMT 2017
 * GENERATED: 5 / 9 / 2017 - 7:38:21
 **/
var BaseModel = require('../utils/model.js')
var util = require('util')
var Faq = function () {
	var params = [{
		table:'faq',
		fields :[{"Field":"id","Type":"int(11)","Null":"NO","Key":"PRI","Default":null,"Extra":"auto_increment"},{"Field":"question","Type":"text","Null":"YES","Key":"","Default":null,"Extra":""},{"Field":"answer","Type":"text","Null":"YES","Key":"","Default":null,"Extra":""},{"Field":"active","Type":"tinyint(1)","Null":"YES","Key":"","Default":null,"Extra":""},{"Field":"timestamp","Type":"timestamp","Null":"NO","Key":"","Default":"CURRENT_TIMESTAMP","Extra":""}],
		model:'mysql'
	}]
	BaseModel.apply(this, params)
	return this
};
util.inherits(Faq, BaseModel)
module.exports = Faq