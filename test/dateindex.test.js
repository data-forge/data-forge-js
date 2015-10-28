'use strict';

describe('DateIndex', function () {
	
	var panjas = require('../index');
	
	var expect = require('chai').expect;
	
	it('can get index values', function () {
		
		var dateIndex = new panjas.DateIndex(
			[
				new Date(1975, 2, 24),
				new Date(2015, 2, 28),			
			]
		);
		
		expect(dateIndex.values()).to.eql(
			[
				new Date(1975, 2, 24),
				new Date(2015, 2, 28),			
			]
		);
	});
	
	it('can skip', function () {
		var dateIndex = new panjas.DateIndex(
			[
				new Date(1975, 2, 24),
				new Date(2011, 2, 28),
				new Date(2012, 2, 28),
				new Date(2015, 2, 28),			
			]
		);
		
		var skipIndex = dateIndex.skip(2);		
		expect(skipIndex.values()).to.eql(
			[new Date(2012, 2, 28), new Date(2015, 2, 28)]		
		);
	});
});