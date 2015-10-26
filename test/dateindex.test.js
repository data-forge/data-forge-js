'use strict';

describe('DateIndex', function () {
	
	var DateIndex = require('../dateindex');
	
	var expect = require('chai').expect;
	
	it('can get index values', function () {
		
		var dateIndex = new DateIndex(
			[
				new Date(1975, 24, 2),
				new Date(2015, 24, 2),			
			]
		);
		
		expect(dateIndex.values()).to.eql(
			[
				new Date(1975, 24, 2),
				new Date(2015, 24, 2),			
			]
		);
	});
	
});