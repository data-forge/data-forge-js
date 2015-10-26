'use strict';


describe('Series', function () {
	
	var Series = require('../series');
	
	var expect = require('chai').expect; 
	
	var initExampleSeries = function () {
		var index = [new Date(1975, 24, 2), new Date(1975, 24, 2)];
		var values = [100, 200];
		return new Series(index, values);		
	};
	
	it('throws exception when index and values arrays do not have equal length', function () {
		
		expect(function () {
			var index = [new Date(1975, 24, 2)];
			var values = [100, 200];
			new Series(index, values);			
		}).to.throw();

		expect(function () {
			var index = [new Date(1975, 24, 2), new Date(1975, 24, 2)];
			var values = [100];
			new Series(index, values);			
		}).to.throw();
	})
	
	it('can get series index', function () {
		
		var series = initExampleSeries();		
		expect(series.index()).to.eql([			
			new Date(1975, 24, 2),
			new Date(1975, 24, 2)			
		]);		
	});
	
	it('can get series values', function () {
		
		var series = initExampleSeries();		
		expect(series.values()).to.eql([			
			100,
			200			
		]);		
	});
});