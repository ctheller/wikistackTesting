var chai = require('chai');
var expect = chai.expect;
var spies = require('chai-spies');
chai.use(spies);
var models = require('../models');
var Page = models.Page;

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

	  	var arr1, arr2, arr3;
  	  beforeEach(function (done) {
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
	  			title: 'noShared',
	  			content: 'bar',
	  			tags: ['baz', 'box']
	  		};

	  		Promise.all([obj1, obj2, obj3].map(function (obj) {
	  			return Page.create(obj);
	  		}))
	  		.then(function (arr) {
	  					arr1 = arr[0];
	  					arr2 = arr[1];
	  					arr3 = arr[2];
	  					done();
	  				})
	  		.catch(done);
	  	});

    describe('findSimilar', function () {
      it('never gets itself', function (done) {
      	arr1.findSimilar().then(function(similarPages){
      		expect(similarPages).not.to.include(arr1);
      		done();
      	}).catch(done);
      });
      it('gets other pages with any common tags');
      it('does not get other pages without any common tags');
    });
  });

  describe('Validations', function () {
    it('errors without title');
    it('errors without content');
    it('errors given an invalid status');
  });

  describe('Hooks', function () {
    it('it sets urlTitle based on title before validating');
  });

});

