'use strict';

describe('NumberIndex', function () {
	
	var NumberIndex = require('../numberindex');
	
	var expect = require('chai').expect;
	
	it('can get index values', function () {
		
		var dateIndex = new NumberIndex(
			[
				101,
				532,			
			]
		);
		
		expect(dateIndex.values()).to.eql(
			[
				101,
				532,			
			]
		);
	});
	
});