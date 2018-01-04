var assert = require('assert');
var request = require('request');

var options = {};
options.headers = {
	'content-type': 'application/x-www-form-urlencoded'
};

describe('Test de conexión', function () {
	it('App responding', function (done) {
		options.url = 'http://localhost:3000/health';
		request.get(options, (err, res, body) => {
			assert.equal(res.statusCode, 200, "StatusCode must be 200");
			done()
		});
	});
});
describe('Test de Autenticación',function(){
	it('register-citizen'/*,function(done){
		let user = {

		}
		options.url = 'http://localhost:3000/api/auth/register';
		request.get(options, (err, res, body) => {
			done()
		})
	}*/)
	it('register-evaluator'/*,function(done){
		let user = {

		}
		options.url = 'http://localhost:3000/health/register_evaluator';
		request.get(options, (err, res, body) => {
		})
	}*/)
	it('register-entity'/*,function(done){
		let user = {

		}
		options.url = 'http://localhost:3000/health/register_entity';
		request.get(options, (err, res, body) => {
		})
	}*/)
	it('change-password'/*,function(done){
		let user = {

		}
		options.url = 'http://localhost:3000/health/register_entity';
		request.get(options, (err, res, body) => {
		})
	}*/)

})