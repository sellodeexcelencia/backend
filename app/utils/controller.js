var utiles = require('./utiles.js')

// This is the generic Controller, all controllers inherits from this one.
var Controller = function (getMap, postMap, putMap, deleteMap) {
  /*
  The main idea of a controller is a component where we can map a url with a function.
  there are some minor differences depending on the method in the request.
  That function must always return a Promise
  */

  this.get = function (params, token, queryParams, req, res) {
    if (!getMap) return utiles.informError(405)
    var option = params[0].split('/')[0]

    var rta = getMap.get(option)
    if (!rta) return utiles.informError(404)
    else {
      var method = rta.method
      var permitsNeeded = rta.permits
      return utiles.authorize(token, permitsNeeded).then((user) => {
        return method(user, queryParams, req, res)
      })
    }
  }

  this.post = function (params, token, body, files) {
    if (!postMap) return utiles.informError(405)
    var option = params[0].split('/')[0]

    var rta = postMap.get(option)
    if (!rta) return utiles.informError(404)
    else {
      var method = rta.method
      var permitsNeeded = rta.permits
      return utiles.authorize(token, permitsNeeded).then((user) => {
        return method(user, body, files)
      })
    }
  }

  this.put = function (params, token, body, files) {
    if (!putMap) return utiles.informError(405)
    var option = params[0].split('/')[0]

    var rta = putMap.get(option)
    if (!rta) return utiles.informError(404)
    else {
      var method = rta.method
      var permitsNeeded = rta.permits
      return utiles.authorize(token, permitsNeeded).then((user) => {
        return method(user, body ,files)
      })
    }
  }

  this.delete = function (params, token, body) {
    if (!deleteMap) return utiles.informError(405)
    var option = params[0].split('/')[0]

    var rta = deleteMap.get(option)
    if (!rta) return utiles.informError(404)
    else {
      var method = rta.method
      var permitsNeeded = rta.permits
      return utiles.authorize(token, permitsNeeded).then((user) => {
        return method(user, body)
      })
    }
  }

  return this
}

module.exports = Controller
