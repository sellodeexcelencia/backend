var BaseController = require('../utils/controller.js')
var util = require('util')
var utiles = require('../utils/utiles.js')
var Permissions = require('../utils/permissions.js')

var User = require('../models/user.js')
var Session = require('../models/session.js')
var User_role_model = require('../models/user_role.js')
var emiter = require('../events/emiter.js').instance
/* generador de password random*/
var pass_generator = require('generate-password')

var Auth = function () {
    var userModel = new User()
    var sessionModel = new Session()
    var user_role = new User_role_model()

    var getMap = new Map(),
        postMap = new Map(),
        putMap = new Map(),
        deleteMap = new Map()

    // ---------------------------------------------------------------
    /**
     * @api {get} /auth/activate
     * @apiVersion 0.0.1
     * @apiName activate
     * @apiGroup Auth
     * @apiPermission none
     * activates an user email
     */
    var activate = function (token, params) {
        if (!params.email) { throw utiles.informError(400) }
        return userModel.getUser(params.email).then((user) => {
            if (!user) throw utiles.informError(202) // user doesnt exists
            return userModel.update({ active: 1, verified: 1 }, { id: user.id })
        })
    }

    getMap.set("activate", { method: activate, permits: Permissions.NONE })

    //-----------------------------------------------------------------------

    /**
     * @api {put} /auth/password Change the password
     * @apiVersion 0.0.1
     * @apiName updatePassword
     * @apiGroup Auth
     * @apiPermission none
     * 
     * @apiParam {String} email
     * @apiParam {String} password_old 
     * @apiParam {String} password_new 
     * 
     */
    var update_password = function (token, body) {
        return userModel.getUser(body.email).then((user) => {
            if (!user) throw utiles.informError(202) // user doesnt exists
            else {
                var pass = utiles.createHmac('sha256')
                pass.update(body.password_old)
                pass = pass.digest('hex')
                if (user.password === pass) {
                    if (user.active === 0) throw utiles.informError(203) //user inactive
                    delete user.password
                    pass = utiles.createHmac('sha256')
                    pass.update(body.password_new)
                    pass = pass.digest('hex')
                    user.password = pass
                } else throw utiles.informError(200) //login failed
                //emiter.emit('user.updatepassword',user,body.password_new)
                return userModel.update({ password: user.password }, { id: user.id })
            }
        })
    }
    putMap.set("password", { method: update_password, permits: Permissions.NONE })
    //-----------------------------------------------------------------------

    /**
     * @api {post} /auth/login_fb
     * @apiVersion 0.0.1
     * @apiGroup Auth
     * @apiPermission none
     * Login FB
     */
    var login_fb = function (token, body) {
        let user = null
        let p = new Promise((resolve,reject)=>{
            return new Promise((_resolve,_reject)=>{
                let https = require('https')
                const options = {
                    hostname: 'graph.facebook.com',
                    port: 443,
                    path: '/v2.10/me?fields=first_name,last_name,email&access_token='+body.token,
                    method: 'GET',
                    headers:{
                        'content-type':'application/json'
                    }
                  };
                https.get(options, (res)=> {
                    res.setEncoding('utf8');
                    let rawData = '';
                    res.on('data', (chunk) => { rawData += chunk; });
                    res.on('end', () => {
                      try {
                        const parsedData = JSON.parse(rawData);
                        _resolve(parsedData);
                      } catch (e) {
                        _reject(e.message);
                      }
                    });
                }).end();
            }).then((u)=>{
                user = u
                return userModel.getUser(user.email)
            }).then((_user)=>{
                if(!_user){
                    return register(null,{
                        name:user.first_name,
                        lastname:user.last_name,
                        email:user.email,
                        terms:1
                    },'1',1).then(()=>{
                        return login(null,user,1)
                    })
                }
                if(_user.role != 'Ciudadano'){
                    return
                }
                return login(null,user,1)
            }).then((response)=>{
                if(!response){
                    reject(utiles.informError(100))
                }else{
                    resolve(response)
                }
            })
        });
        return p
    }

    /**
     * 
     */
    var login_google = function (_user, body) {
        let user = null
        let p = new Promise((resolve,reject)=>{
            return new Promise((_resolve,_reject)=>{
                let https = require('https')
                https.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token='+body.token, (res)=> {
                    const { statusCode } = res;
                    const contentType = res.headers['content-type'];
                  
                    let error;
                    if (statusCode !== 200) {
                      error = new Error('Request Failed.\n' +
                                        `Status Code: ${statusCode}`);
                    } else if (!/^application\/json/.test(contentType)) {
                      error = new Error('Invalid content-type.\n' +
                                        `Expected application/json but received ${contentType}`);
                    }
                    if (error) {
                      reject(error.message);
                      // consume response data to free up memory
                      res.resume();
                      return;
                    }
                  
                    res.setEncoding('utf8');
                    let rawData = '';
                    res.on('data', (chunk) => { rawData += chunk; });
                    res.on('end', () => {
                      try {
                        const parsedData = JSON.parse(rawData);
                        _resolve(parsedData);
                      } catch (e) {
                        _reject(e.message);
                      }
                    });
                }).end();
            }).then((u)=>{
                user = u
                return userModel.getUser(user.email)
            }).then((_user)=>{
                if(!_user){
                    return register(null,{
                        name:user.given_name,
                        lastname:user.family_name,
                        email:user.email,
                        terms:1
                    },'1',1).then(()=>{
                        return login(null,user,1)
                    })
                }
                if(_user.role != 'Ciudadano'){
                    return
                }
                return login(null,user,1)
            }).then((response)=>{
                if(!response){
                    reject(utiles.informError(100))
                }else{
                    resolve(response)
                }
            })
        });
        return p
    }

    /**
     * 
     */
    var login_linkedin = function (user, body) {
        console.log(body)

    }

    /**
     * @api {post} /auth/login Login as a user
     * @apiVersion 0.0.1
     * @apiName loginUser
     * @apiGroup Auth
     * @apiPermission none
     *
     * @apiDescription In this case "apiErrorStructure" is defined and used.
     * Define blocks with params that will be used in several functions, so you dont have to rewrite them.
     *
     * @apiParam {String} name Name of the User.
     * @apiParam {String} password Password of the User.
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     *     {
     *       token:"123456789abcdef"
     *     }
     *
     */
    // TODO: deben validarse que llegan todos los parametros
    var login = function (token, body, _force) {
        _force = _force || false
        return userModel.getUser(body.email).then((user) => {
            if (!user) throw utiles.informError(202) // user doesnt exists
            else {
                var pass = utiles.createHmac('sha256')
                if(!_force){
                    pass.update(body.password)
                    pass = pass.digest('hex')
                }
                if (user.password === pass || _force) {
                    if (user.active === 0) {
                        throw utiles.informError(203) //user inactive
                    }
                    delete user.password // encode
                    var now = new Date()
                    now.setDate(now.getDate() + 1) // the token expires in 15 days
                    var session = {
                        token: utiles.sign(user),
                        id_user: user.id,
                        expires: now
                    }
                    sessionModel.create(session)
                    var answer = utiles.informError(0)
                    answer.token = session.token
                    return answer
                } else {
                    throw utiles.informError(200)
                }
            }
        })
    }

    /**
     * @api {post} /auth/register Register a new User
     * @apiVersion 0.0.1
     * @apiName registerUser
     * @apiGroup Auth
     * @apiPermission none
     *
     * @apiDescription In this case "apiErrorStructure" is defined and used.
     * Define blocks with params that will be used in several functions, so you dont have to rewrite them.
     *
     * @apiParam {String} name Name of the User.
     *
     * @apiSuccess {Number} id The new Users-ID.
     *
     * @apiUse CreateUserError
     */
    // TODO: deben validarse que llegan todos los parametros
    var register = function (token, body, role_seguro,_active) {
        var pass_user = ""
        _active = _active || '0'
        return userModel.getUser(body.email).then((user) => {
            if (user) throw utiles.informError(201) // user already exists
            else {
                if (body.email === undefined) {
                    throw utiles.informError(400)
                }
                let tmp_pwd = false
                //Generar password temporal para evaluador a registrar y activar por e-mail
                if (body.password === undefined) {
                    pass_user = pass_generator.generate({
                        length: 8,
                        numbers: true
                    })
                    tmp_pwd = true
                } else {
                    pass_user = body.password
                }
                var pass = utiles.createHmac('sha256')
                pass.update(pass_user)
                pass = pass.digest('hex')
                return userModel.create({
                    name: body.name || "",
                    secondname: body.secondname || "",
                    lastname: body.lastname || "",
                    secondlastname: body.secondlastname || "",
                    email: body.email,
                    phone: body.phone || "",
                    extension: body.extension || "",
                    mobile: body.mobile || "",
                    organization: body.organization || null,
                    ocupation: body.ocupation || null,
                    education_level: body.education_level || null,
                    password: pass,
                    tmp_pwd: tmp_pwd,
                    points: "0",
                    active: _active,
                    verified: false,
                    terms: body.terms,
                    newsletter: body.newsletter === "true",
                    id_availability: (body.id_availability) ? parseInt(body.id_availability) : null,
                    id_city: (body.id_city) ? parseInt(body.id_city) : null,
                    id_region: (body.id_region) ? parseInt(body.id_region) : null,
                    id_country: (body.id_country) ? parseInt(body.id_country) : null,
                    document: body.document || null,
                    id_type_document: (body.id_type_document) ? parseInt(body.id_type_document) : null
                }).then(function (user) {
                    // if the user was created sucessfully
                    if (user) {
                        let role = ""
                        if (!body.role) {
                            body.role = role_seguro
                        }
                        body.id = body.id || user.insertId
                        //create the role assignment
                        user_role.create({
                            id_user: body.id,
                            id_role: parseInt(body.role)
                        })
                        if (body.role == 4) {
                            var institution_user_model = require("../models/institution_user.js")
                            var institution_user = new institution_user_model()
                            institution_user.create({
                                id_institution: body.institution.id,
                                id_user: body.id
                            })
                            var institution_model = require("../models/entity_institution.js")
                            var institution = new institution_model()
                            institution.update(body.institution, { id: body.institution.id })
                        }
                        if (body.role == 2) {
                            let user_category = require('../models/user_category.js')
                            let model_user_category = new user_category()
                            body.categories.forEach((value) => {
                                let data = { id_user: body.id, id_category: value.id }
                                model_user_category.create(data)
                            }, this)
                            let user_questiontopic = require('../models/user_questiontopic.js')
                            let model_user_questiontopic = new user_questiontopic()
                            body.topics.forEach((value) => {
                                let data = { id_user: body.id, id_topic: value.id }
                                model_user_questiontopic.create(data)
                            }, this)
                        }
                        emiter.emit('user.registered',body,pass_user);
                        return { error: utiles.informError(0), data: body }
                    } else {
                        //if there was an error on creating the user
                        throw utiles.informError(300)
                    }
                })
            }
        })
    }


    /**
     * @api {post} /auth/recover Recover a user password
     * @apiVersion 0.0.1
     * @apiName recoverPasswordUser
     * @apiGroup Auth
     * @apiPermission none
     *
     * @apiDescription In this case "apiErrorStructure" is defined and used.
     * Define blocks with params that will be used in several functions, so you dont have to rewrite them.
     *
     * @apiParam {String} name Name of the User.
     *
     * @apiSuccess {Number} id The new Users-ID.
     *
     * @apiUse CreateUserError
     */
    // TODO: deben validarse que llegan todos los parametros
    var recover = function (token, body) {
        return userModel.getUser(body.email).then((user) => {
            if (!user) throw utiles.informError(202) // user doesnt exists
            else {
                var pass_user = pass_generator.generate({
                    length: 8,
                    numbers: true
                })
                var pass = utiles.createHmac('sha256')
                pass.update(pass_user)
                pass = pass.digest('hex')
                user.password = pass
                emiter.emit('user.updatepassword',user, pass_user)
                return userModel.update({ password: user.password, tmp_pwd: 1 }, { id: user.id })
            }
        })
    }


    //-------------------------------------------------------------------------
    /**
     * @api {post} /auth/register_user Register a new User
     * @apiVersion 0.0.1
     * @apiName registerUser
     * @apiGroup Auth
     * @apiPermission none
     */
    var register_user = function (token, body) {
        return register(token, body, '1')
    }

    /**
     * @api {post} /auth/register_evaluator Register a new Evaluator
     * @apiVersion 0.0.1
     * @apiName registerEvaluator
     * @apiGroup Auth
     * @apiPermission none
     */
    var register_evaluator = function (token, body) {
        return register(token, body, '2')
    }

    /**
     * @api {post} /auth/register_administrator Register a new Administrator
     * @apiVersion 0.0.1
     * @apiName registerAdministrator
     * @apiGroup Auth
     * @apiPermission none
     */
    var register_administrator = function (token, body) {
        return register(token, body, '3')
    }

    /**
     * @api {post} /auth/register_entity Register a new Entity
     * @apiVersion 0.0.1
     * @apiName registerEntity
     * @apiGroup Auth
     * @apiPermission none
     */
    var register_entity = function (token, body) {
        return register(token, body, '4')
    }
    //-------------------------------------------------------------------------

    /**
     * @api {post} /auth/renew Gets a new token for a given user
     * @apiVersion 0.0.1
     * @apiName renew
     * @apiGroup Auth
     * @apiPermission none
     */
    var renewToken = function (user, body) {
        if (!user.id) {
            throw utiles.informError(400)
        }
        return userModel.getUser(user.email).then((user) => {
            delete user.password
            var now = new Date()
            var Session = require('../models/session.js')
            var sessionModel = new Session()
            now.setDate(now.getDate() + 1) // the token expires in 1 days
            var session = {
                token: utiles.sign(user),
                id_user: user.id,
                expires: now
            }
            sessionModel.create(session)
            var answer = utiles.informError(0)
            answer.token = session.token
            return answer
        })
    }

    /**
     * @api {post} /auth/password Updates the password of a given user
     * @apiVersion 0.0.1
     * @apiName password
     * @apiGroup Auth
     * @apiPermission none
     * @apiDescription Gets an old password and sets a new one
     *
     * @apiParam {String} old Old password
     * @apiParam {String} password New password
     */
    var password = function (user, body) {
        if (!user.id) {
            throw utiles.informError(400)
        }
        body.id = user.id
        return userModel.getUser(user.email).then((user) => {
            var pass = utiles.createHmac('sha256')
            pass.update(body.old)
            pass = pass.digest('hex')
            if (user.password === pass) {
                if (user.active === 0) {
                    throw utiles.informError(203) //user inactive
                }
                var pass = utiles.createHmac('sha256')
                pass.update(body.password)
                pass = pass.digest('hex')
                userModel.update({ id: body.id, password: pass, tmp_pwd: 0 }, { id: body.id })
                return utiles.informError(0)
            } else {
                throw utiles.informError(200)
            }
        })
    }
    postMap.set('login', { method: login, permits: Permissions.NONE })
    postMap.set('login_fb', { method: login_fb, permits: Permissions.NONE })
    postMap.set('login_google', { method: login_google, permits: Permissions.NONE })
    postMap.set('login_linkedin', { method: login_linkedin, permits: Permissions.NONE })
    postMap.set('renew', { method: renewToken, permits: Permissions.NONE })
    postMap.set('password', { method: password, permits: Permissions.NONE })
    postMap.set('recover', { method: recover, permits: Permissions.NONE })
    postMap.set('register', { method: register_user, permits: Permissions.NONE })
    postMap.set('register_evaluator', { method: register_evaluator, permits: Permissions.NONE })
    postMap.set('register_entity', { method: register_entity, permits: Permissions.NONE })
    postMap.set('register_administrator', { method: register_administrator, permits: Permissions.NONE })

    var params = [getMap, postMap, putMap, null]
    BaseController.apply(this, params)

    return this
}

util.inherits(Auth, BaseController)

module.exports = Auth
