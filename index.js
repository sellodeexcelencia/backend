'use strict'

//
//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// A Buddha statue to bless your code to be bug free.

/*
This is the main script of the aplication. it can be used in an external source.
using something like this:
----
var configJSON = {...};
var back = require("index.js");
var back_instance = new back(configJSON);
----
Or it coul be started by the cli and it will search the config file in this path:
"./config.json"

The structure of a config JSON must be:
*/
var Backend = function (configJSON) {
  var config = configJSON || require('./config.json')
  var Generator = require('./app/generator/mysql-parser.min.js')
  var generator = new Generator()
  generator.parse(false).then(()=>{
    require('./app/events/events.js')()
  })
  var verbose = config.verbose === true

  // If we are using Google app engine to deploy the app
  if (config.googleDebug === true) {
    require('@google/cloud-trace').start()
    require('@google/cloud-debug')
  }

  // We create an Express app and enable Cross-origin resource sharing (CORS)
  var express = require('express')
  var methodOverride = require('method-override')
  var cors = require('cors')
  var path = require('path')

  var app = express()
  if (verbose) {
    var morgan = require('morgan')
    app.use(morgan('dev')) // Log every request to the console
  }
  app.use(express.static(path.join(__dirname, 'public')))
  app.use(methodOverride('X-HTTP-Method-Override')) // Override with the X-HTTP-Method-Override header in the request
  var whitelist = config.autorizedHosts
  var corsOptions = {
    origin: function (origin, callback) {
      var originIsWhitelisted = whitelist.indexOf(origin) !== -1
      callback(null, originIsWhitelisted)
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
  }

  // Sign with default (HMAC SHA256)
  app.use(cors(corsOptions))

  // Enabling CORS Pre-Flight, for DELETE
  app.options('*', cors())

  // The routing logic of the app will be on this file.
  require('./app/routes.js')(app)

  // This turns on the app
  app.set('port', (process.env.PORT || config.port || 5000))

  var server,httpsServer

  this.start = function () {
    return new Promise((resolve, reject) => {
  // Uncomment to HTTPS
        var fs = require('fs');
        const options = {
                key: fs.readFileSync('/root/sellodeexcelencia.gov.co/privkey.pem'),
                cert: fs.readFileSync('/root/sellodeexcelencia.gov.co/cert.pem'),
                ca: fs.readFileSync('/root/sellodeexcelencia.gov.co/chain.pem')
        };
        var https = require('https');
        httpsServer = https.createServer(options, app).listen(app.get('port'), () => {
                        if (verbose) {
                                console.log('Node app is running on port', app.get('port'));
                                console.log("Using profile: " + config.enviroment);
                        }
                });
        var http = require('http');
        server = http.createServer(function (req, res) {
                        res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
                        res.end();
                }).listen(80);
    })
  }

  this.close = function () {
  httpsServer.close()
    server.close()
  }
}

module.exports = Backend

if (module === require.main) {
  var instance = new Backend()
  instance.start()
}
