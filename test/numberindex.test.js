'use strict';

describe('NumberIndex', function () {
	
	var panjas = require('../index');
	
	var expect = require('chai').expect;
	
	it('can get index values', function () {
		
		var dateIndex = new panjas.NumberIndex(
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