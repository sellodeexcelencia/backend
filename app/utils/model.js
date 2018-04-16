var config = require('../../config.json')

// This is the generic model, all models inherits from this one.
var ModelMysql = require('./model-mysql.js')
var EntityMysql = require('./entity-mysql.js')

/*
A model is a component where we can make crud operations over a table. It is intended to be parametrisable.
So if the dev wants to use a diferent database it only will need to create a new file
'model-new.js' and add a 'else if' in the code
*/
var Model = function (params) {
  params.model  = params.model || config.defaultModel
  var selectedModel
  if (params.model === 'mysql') selectedModel = new ModelMysql(params)
  if (params.model === 'entity') selectedModel = new EntityMysql(params)
  else selectedModel = new ModelMysql(params)

  for(let i in selectedModel){
    if(typeof selectedModel[i] === "function"){
      this[i] = function(){
        return selectedModel[i](...arguments)
      }
    }
  }
}

module.exports = Model
