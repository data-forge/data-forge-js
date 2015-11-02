'use strict';


describe('BaseSeries', function () {
	
	var panjas = require('../index');
	var BaseSeries = require('../src/baseseries');
	
	var expect = require('chai').expect; 
	
	var initExampleSeries = function () {
		var series = new BaseSeries();
		series.values = function () {
			return [100, 200];
		}
		return series;		
	};
	
	var initExampleSeries2 = function () {
		var series = new BaseSeries();
		series.values = function () {
			return [100, 300, 200, 5];
		}
		return series;		
	};

	it('can skip', function () {
		var series = initExampleSeries2();
		var skipSeries = series.skip(2);		
		expect(skipSeries.values()).to.eql([200, 5]);		
	});

	it('can sort values ascending', function () {		
		var series = initExampleSeries2();
		var sorted = series.order();
		expect(sorted.values()).to.eql([5, 100, 200, 300]);
	});
	
	it('can sort values descending', function () {		
		var series = initExampleSeries2();
		var sorted = series.orderDescending();
		expect(sorted.values()).to.eql([300, 200, 100, 5]);
	});
});
