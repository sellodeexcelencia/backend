var form = require('connect-form2')
var bodyParser = require('body-parser')

var Routes = function (app) {
    /*
  This are the controllers
  - test is for development an debug porpusoses
  - anp store all the mobile app services
  - auth allows authentication
  - admin is used by the CMS web app (by authenticated users)
	*/
    var controllers = [
        { type: 'auth', file: './controllers/auth.js' },
        { type: 'test', file: './controllers/tests.js' },
        { type: 'configuration', file: './controllers/auto_configuration.js' },
        { type: "service", file: "./controllers/auto_service.js" },
        { type: "place", file: "./controllers/auto_place.js" },
        { type: "question", file: "./controllers/auto_question.js" },
        { type: "forum", file: "./controllers/auto_forum.js" },
        { type: "platform", file: "./controllers/auto_platform.js" },
        { type: "stats", file: "./controllers/stats.js" }
    ]
    var formParser = form({ keepExtensions: true }) // POST
    var urlencodedParser = bodyParser.urlencoded({ extended: true }) // PUT, DELETE
    var jsonParser = bodyParser.json() //POST

    // This is middleware that allows to retrive parameters from the POST, PUT & DELETE request
    /*
    This are the routing functions. They separate the request to the diferents controllers.
    There is a special considerations when usig POST, to allow file uploads
    */
    var finishPostPut = function (req, res, body, files) {
        var i, controller
        for (i in controllers) {
            if (controllers[i].type === req.params.type) {
                controller = require(controllers[i].file)()
                break;
            }
        }
        if (controller) {
            let method
            if (req.originalMethod === 'POST') method = controller.post(req.params, req.headers.authorization, body, files)
            else if (req.originalMethod === 'PUT') method = controller.put(req.params, req.headers.authorization, body, files)
            method.then((data) => {
                if (data.error && data.error.htmlCode) res.status(data.error.htmlCode).send(data)
                else res.send(data)
            }).catch((err2) => {
                if (err2.error && err2.error.htmlCode) res.status(err2.error.htmlCode).send(err2)
                else res.send(err2)
            })
        } else res.sendStatus(404)
    };
    var postPutFunction = function (req, res) {
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
        res.header('Access-Control-Allow-Headers', 'accept, content-type, x-parse-application-id, x-parse-rest-api-key, x-parse-session-token')
        let content = req.headers['content-type']
        if (content.indexOf('multipart/form-data') >= 0) {
            req.form.complete((err, fields, files) => {
                if (err) res.sendStatus(500)
                finishPostPut(req, res, fields, files)
            });
        } else {
            finishPostPut(req, res, req.body, null)
        }
    }

    var getDeleteFunction = function (req, res) {
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
        res.header('Access-Control-Allow-Headers', 'accept, content-type, x-parse-application-id, x-parse-rest-api-key, x-parse-session-token')
        var i, controller
        for (i in controllers) {
            if (controllers[i].type === req.params.type) {
                controller = require(controllers[i].file)()
                break
            }
        }
        if (controller) {
            let method
            if (req.originalMethod === 'GET') method = controller.get(req.params, req.headers.authorization, req.query, req, res)
            else if (req.originalMethod === 'DELETE') method = controller.delete(req.params, req.headers.authorization, req.query)

            method.then((data) => {
                if (data) {
                    if(req.query.download){
                        let utiles = require('./utils/utiles.js')
                        let buff = utiles.writeExcelFile(data.data)
                        res.setHeader('Content-Disposition', 'attachment; filename="downloaded.xlsx"');
                        res.status(200)
                        res.send(buff)
                        res.end()
                    }else{
                        if (data.error && data.error.htmlCode) res.status(data.error.htmlCode).send(data)
                        else res.send(data)
                    }
                } else {
                    res.end()
                }
            }).catch((err2) => {
                if (err2.error && err2.error.htmlCode){ 
                    res.status(err2.error.htmlCode).send(err2)
                }
                else {
                    res.status(400)
                    res.send(err2)
                }
            })
        } else res.sendStatus(404)
    }

    app.get('/jobs', (req, res) => {
        var jobs = require('./jobs/jobs.js')
        jobs = new jobs()
        jobs.execute().then((result) => {
            res.send(result)
        })
    })
    app.get('/testmail', (req, res) => {
        var utiles = require('./utils/utiles.js')
        utiles.sendEmail('',null,null,'Prueba Mail','Probando Email')
        .then((result)=>{
            res.send(result)
        })
    })

    app.get('/health', (req, res) => { res.sendStatus(200) })

    /* ---------------- CREATE ---------------- */
    app.post('/api/:type/*', formParser, urlencodedParser, jsonParser, postPutFunction)

    /* ----------------  READ  ---------------- */
    app.get('/api/:type/*', urlencodedParser, getDeleteFunction)

    /* ---------------- UPDATE ---------------- */
    app.put('/api/:type/*', formParser, urlencodedParser, jsonParser, postPutFunction)

    /* ---------------- DELETE ---------------- */
    app.delete('/api/:type/*', urlencodedParser, getDeleteFunction)

    app.get('*', (req, res) => { 
        var path = require('path')
        res.sendFile(path.resolve(__dirname+'/../public/index.html')) 
    })
}

module.exports = Routes
