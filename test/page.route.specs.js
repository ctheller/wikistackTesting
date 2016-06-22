var supertest = require('supertest');
var app = require('../app');
var agent = supertest.agent(app);
var chai = require('chai');
var expect = chai.expect;
var spies = require('chai-spies');
chai.use(spies);
var models = require('../models');
var Page = models.Page;
var things = require('chai-things');
chai.use(things);

describe('http requests', function () {
  
  var base, shared, notShared;
  	  before(function (done) {
	  		var obj1 = {
	  			title: 'base',
	  			content: 'bar',
	  			tags: ['foo', 'bar']
	  		};
	  		var obj2 = {
	  			title: 'shared',
	  			content: 'bar',
	  			tags: ['foo', 'baz']
	  		};
	  		var obj3 = {
	  			title: 'notShared',
	  			content: 'bar',
	  			tags: ['baz', 'box']
	  		};

	  		Promise.all([obj1, obj2, obj3].map(function (obj) {
	  			return Page.create(obj);
	  		}))
	  		.then(function (arr) {
	  					base = arr[0];
	  					shared = arr[1];
	  					notShared = arr[2];
	  					done();
	  				})
	  		.catch(done);
	  	});

  	after(function(done){
	  		Page.destroy({where:{}});
	  		done();
	});

  describe('GET /wiki/', function () {
    it('gets 200 on index', function (done) {
    	agent
    	.get('/wiki')
    	.expect(200, done);
  	});
  });

  describe('GET /wiki/add', function () {
    it('gets 200 on add', function (done) {
    	agent
    	.get('/wiki/add')
    	.expect(200, done);
  	});
  });

  describe('GET /wiki/:urlTitle', function () {
    it('responds with 404 on page that does not exist', function(done){
    	agent.get('/wiki/biddly')
    	.expect(404, done);
    });
    it('responds with 200 on page that does exist', function(done){
    	agent.get('/wiki/base')
    	.expect(200, done);
    });
  });

  describe('GET /wiki/search', function () {
    it('responds with 200', function(done){
    	agent.get('/wiki/search')
    	.expect(200, done);
    });
  });

  describe('GET /wiki/:urlTitle/similar', function () {
    it('responds with 404 for page that does not exist', function(done){
    	agent.get('/wiki/biddly/similar')
    	.expect(404, done);
    });
    it('responds with 200 for similar page', function(done){
    	agent.get('/wiki/base/similar')
    	.expect(200, done);
    });
  });

  describe('POST /wiki', function () {
    it('responds with 302',function(done){
    	agent
    	.post('/wiki')
    	.send({name:"author", email:"some@email.com", title:"newExample", content:"some words"})
    	.expect(302, done);
    });
    it('creates a page in the database', function(done){
    	Page.findOne({where: {urlTitle: 'newExample' }})
    	.then(function(result){
    		expect(result.dataValues.urlTitle).to.equal('newExample');
    		done();
    	}).catch(done);
    });
  });

});