/*
This controller is used to remote test thes app.
Its intended to check the health of the app, the connection with the database and
other external apis we use.

The dev tests must not be mapped in this controller
*/

// We require this file to be a controller so we can use
var BaseController = require('../utils/controller.js')
var util = require('util')
var utiles = require('../utils/utiles.js')
var permissions = require('../utils/permissions.js')

// we use mocha to run the test files and path to find them
// The test are in the '../tests' folder
var Mocha = require('mocha')
var path = require('path')

function formatTest (test) {
  return {
    title: test.title,
    fullTitle: test.fullTitle(),
    duration: test.duration,
    state: test.state,
    err: errorJSON(test.err || {}),
    code: Mocha.utils.clean(test.body.toString())
  }
}

function errorJSON (err) {
  return Object.getOwnPropertyNames(err)
    .reduce(function (output, key) {
      // Remove any key whose value cannot be stringified
      try {
        JSON.stringify(err[key])
      } catch (e) {
        if (e.message === 'Converting circular structure to JSON') {
          return output
        }
      }
      // Value is not circular, add it to our output
      output[key] = err[key]
      return output
    }, {})
}

function resolveTest (name) {
  var mocha = new Mocha()
  var ruta = __dirname.split('/')
  ruta.pop()
  var testDir = ruta.join('/') + '/tests'
  var filename = path.join(testDir, name + '.js')
  delete require.cache[filename]
  mocha.addFile(filename)

  return new Promise((resolve, reject) => {
    var tests = []
    var pending = []

    mocha.run()
      .on('test end', test => { if(test.state){tests.push(test)}  })
      .on('pending', test => { pending.push(test) })
      .on('end', function () {
        var obj = {
          tests: tests.map(formatTest),
          pending: pending.map(formatTest)
        }
        resolve(obj)
      })
  })
}

var Test = function () {
  // --------------------------------------------------------------
  var getMap = new Map()

  var run = function (user, params) {
    return resolveTest(params.test)
  }

  getMap.set('run', {method: run, permits: permissions.NONE})

  var params = [getMap, null, null, null]
  BaseController.apply(this, params)
  // --------------------------------------------------------------

  return this
}

util.inherits(Test, BaseController)

module.exports = Test
