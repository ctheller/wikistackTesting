var chai = require('chai');
var expect = chai.expect;
var spies = require('chai-spies');
chai.use(spies);
var models = require('../models');
var Page = models.Page;
var things = require('chai-things');
chai.use(things);


// var props = {
// 	title: 'page title',
// 	urlTitle: 'page_title',
// 	content: '#here is our #content'
// };

// describe('an instance of a page', function () {
// 	describe('properties on an instance', function () {
// 		it('has a title which is a string', function (done) {
// 			Page.create(props)
// 			.then(function (newPage) {
// 				console.log(newPage);
// 				newPage = newPage.dataValues;
// 				var theTitle = newPage.title;
// 				expect(theTitle).to.equal('page title');
// 				expect(typeof theTitle).to.equal('string');
// 				done();
// 			}).catch(done); 
// 		});
// 		it('has a urlTitle which is a string', function (done) {
// 			Page.create(props)
// 			.then(function (newPage) {
// 				console.log(newPage);
// 				newPage = newPage.dataValues;
// 				var theUrlTitle = newPage.urlTitle;
// 				expect(theUrlTitle).to.equal('page_title');
// 				expect(typeof theUrlTitle).to.equal('string');
// 				expect(theUrlTitle.indexOf(" ")).to.equal(-1);
// 				done();
// 			}).catch(done); 
// 		});
// 	});
// });

describe('Page model', function () {

  after(function(done){
        Page.destroy({where:{}});
        done();
      });

  describe('Virtuals', function () {

  	var page;
  	beforeEach(function (done) {
  		page = Page.build();
  		done();
  	});
    describe('route', function () {
      it('returns the url_name prepended by "/wiki/"', function () {
      	page.urlTitle = 'some_title';
      	expect(page.route).to.equal('/wiki/some_title');
      });
    });
    describe('renderedContent', function () {
      it('converts the markdown-formatted content into HTML', function () {
      	page.content = 'I am using __markdown__.';
      	expect(page.renderedContent).to.equal('<p>I am using <strong>markdown</strong>.</p>\n');
      });
    });
  });

  describe('Class methods', function () {

  	beforeEach(function (done) {
  		Page.create({
  			title: 'foo',
  			content: 'bar',
  			tags: ['foo', 'bar']
  		})
  		.then(function () {
  			done();
  		})
  		.catch(done);
  	});

    describe('findByTag', function () {
      it('gets pages with the search tag', function (done) {
      	Page.findByTag('foo')
      		.then(function (pages) {
      		  expect(pages[0].tags).to.include('foo');
      		  done();
      		})
      		.catch(done);
      });

      it('does not get pages without the search tag', function (done) {
      	  Page.findByTag('bazzy')
      		.then(function (pages) {
      		  expect(pages[0]).to.equal(undefined);
      		  done();
      		})
      		.catch(done);
    	});
    });
  });
  

  describe('Instance methods', function () {

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

    describe('findSimilar', function () {
      it('never gets itself', function (done) {
      	base.findSimilar().then(function(similarPages){
      		var similarPageIds = similarPages.map(function(page){
      			return page.dataValues.id;
      		})
      		expect(similarPageIds).not.to.contain(base.dataValues.id);
      		done();
      	}).catch(done);
      });
      it('gets other pages with any common tags', function (done) {
      	base.findSimilar().then(function(similarPages){
      		var similarPageIds = similarPages.map(function(page){
      			return page.dataValues.id;
      		})
      		expect(similarPageIds).to.contain(shared.dataValues.id);
      		done();
      	}).catch(done); 
      });   
      it('does not get other pages without any common tags', function (done) {
      	base.findSimilar().then(function(similarPages){
      		var similarPageIds = similarPages.map(function(page){
      			return page.dataValues.id;
      		})
      		expect(similarPageIds).not.to.contain(notShared.dataValues.id);
      		done();
      	}).catch(done); 
      });
    });   
  });

  describe('Validations', function () {
    it('errors without title', function(done){
      var page = Page.build({urlTitle: "hey", content:"content"});
      page.validate()
      .then(function(result){
        expect(result).not.to.equal(null);
        expect(result.errors).to.contain.a.thing.with.property("path", "title");
        done();
      });
    });
    it('errors without content', function(done){
      var page = Page.build({title: 'url', urlTitle: 'url'});
      page.validate()
      .then(function(result){
        expect(result).not.to.equal(null);
        expect(result.errors).to.contain.a.thing.with.property("path", "content");
        done();
      })
    });
    it('errors given an invalid status', function(done){
      var page = Page.build({title: 'url', urlTitle: 'url', content:'content', status:'chicken'});
      page.save()
      .then(function(){
        done();
      })
      .catch(function(err){
        expect(err).to.exist;
        expect(err).to.have.property("name", "SequelizeDatabaseError");
        done();
      });
    });
  });

  describe('Hooks', function () {
    it('it sets urlTitle based on title before validating', function(done){
      Page.create({title: 'urls are so/ cool', content:'content'})
    .then(function(newPage){
      expect(newPage.urlTitle).to.equal("urls_are_so_cool");
      done();
    })
    .catch(done);

    });
  });

});

