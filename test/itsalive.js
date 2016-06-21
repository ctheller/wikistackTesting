// var chai = require('chai');
// var expect = chai.expect;
// var spies = require('chai-spies');
// chai.use(spies);

// console.log("wow!");

// describe("test suite functionality", function(){
// 	it('does arithmetic', function(){
// 		expect(2+2).to.equal(4);
// 	});	
// 	it('handles asynchronous code', function(done){
// 		var startTime = new Date().getTime();
// 		setTimeout(function(){
// 			var duration = new Date().getTime();
// 			expect(duration).to.be.above(startTime+1000);
// 			done();
// 		}, 1000);
// 	});
// 	it('spies on functions correctly', function(){
// 		var array = [1,2,3,4,5];
// 		function f () {}
// 		var fSpy = chai.spy(f);
// 		array.forEach(fSpy);
// 		expect(fSpy).to.have.been.called.exactly(5);

// 	});
// });
