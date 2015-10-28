'use strict';


describe('LazySeries', function () {
	
	var panjas = require('../index');
	
	var expect = require('chai').expect; 
	
	var initExampleSeries = function () {
		var index = new panjas.DateIndex([new Date(1975, 2, 24), new Date(2015, 2, 28)]);
		var valuesFn = function () {
			return [100, 200];
		};
		return new panjas.LazySeries(index, valuesFn);		
	};
	
	var initExampleSeries2 = function () {
		var index = new panjas.DateIndex([new Date(1975, 2, 24), new Date(2011, 2, 28), new Date(2012, 2, 28), new Date(2015, 2, 28)]);
		var valuesFn = function () {
			return [100, 300, 200, 5];
		};
		return new panjas.LazySeries(index, valuesFn);		
	};
	
	
	/* Can't really do this check, it will break lazy evaluation.
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
	});
	*/
	
	it('can get series index', function () {
		
		var series = initExampleSeries();		
		expect(series.index().values()).to.eql([			
			new Date(1975, 2, 24),
			new Date(2015, 2, 28)			
		]);		
	});
	
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