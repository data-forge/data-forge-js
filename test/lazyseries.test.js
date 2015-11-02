'use strict';


describe('LazySeries', function () {
	
	var panjas = require('../index');
	
	var expect = require('chai').expect; 
	
	var initExampleSeries = function () {
		var valuesFn = function () {
			return [100, 200];
		};
		return new panjas.LazySeries(valuesFn);
	};
	
	var initExampleSeries2 = function () {
		var valuesFn = function () {
			return [100, 300, 200, 5];
		};
		return new panjas.LazySeries(valuesFn);
	};
	
	it('can get series values', function () {
		
		var series = initExampleSeries();		
		expect(series.values()).to.eql([			
			100,
			200			
		]);		
	});

	it('can bake lazy series', function () {
		
		var lazySeries = initExampleSeries();		
		var bakedSeries = lazySeries.bake();
		expect(lazySeries).not.to.equal(bakedSeries)
		expect(bakedSeries).to.be.an.instanceOf(panjas.Series);		
	});

});