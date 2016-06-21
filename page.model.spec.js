var chai = require('chai');
var expect = chai.expect;
var spies = require('chai-spies');
chai.use(spies);
var models = require('../models');
var Page = models.Page;

var props = {
	title: 'page title',
	urlTitle: 'page_title',
	content: '#here is our #content'
};

describe('an instance of a page', function () {
	describe('properties on an instance', function () {
		var newPage = Page.create(props);
		it('has a title which is a string', function () {
			var theTitle = newPage.title;
			expect(theTitle).to.be('page title');
			expect(typeof theTitle).to.be('string');
		}); 
	});
});