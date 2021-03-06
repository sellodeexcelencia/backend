/**  * ENTITY AUTO_GENERATED BY DMT-GENERATOR
 * {{ENTITY_NAME}}
 * DMT 2017
 * GENERATED: 6 / 10 / 2017 - 15:43:10
 **/
var BaseModel = require('../utils/model.js')
var util = require('util')
var Category_question = function () {
	var params = [{
	"table": "category_questions",
	"relations": [
		{
			"type": "1-1",
			"name": "category",
			"entity": "category",
			"leftKey": "id_category",
			"foreign_name": "name"
		}
	],
	"entity": "category_question",
	"model": "entity"
}]
	BaseModel.apply(this, params)
	return this
};
util.inherits(Category_question, BaseModel)
module.exports = Category_question