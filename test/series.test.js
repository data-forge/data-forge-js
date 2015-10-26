'use strict';


describe('Series', function () {
	
	var Series = require('../series');
	
	var expect = require('chai').expect; 
	
	it('can get series index', function () {
		
		var series = new Series([
			[new Date(1975, 24, 2), 100],
			[new Date(1975, 24, 2), 200],
		]);
		
		expect(series.index()).to.eql([			
			new Date(1975, 24, 2),
			new Date(1975, 24, 2)			
		]);		
	});
	
	it('can get series values', function () {
		
		var series = new Series([
			[new Date(1975, 24, 2), 100],
			[new Date(1975, 24, 2), 200],
		]);
		
		expect(series.values()).to.eql([			
			100,
			200			
		]);		
	});
});