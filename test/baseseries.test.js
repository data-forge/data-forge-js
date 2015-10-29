'use strict';


describe('BaseSeries', function () {
	
	var panjas = require('../index');
	var BaseSeries = require('../src/baseseries');
	
	var expect = require('chai').expect; 
	
	var initExampleSeries = function () {
		var index = new panjas.DateIndex([new Date(1975, 2, 24), new Date(2015, 2, 28)]);
		var values = [100, 200];
		var series = new BaseSeries();
		series.index = function () {
			return index;
		};
		series.values = function () {
			return values;
		}
		return series;		
	};
	
	var initExampleSeries2 = function () {
		var index = new panjas.DateIndex([new Date(1975, 2, 24), new Date(2011, 2, 28), new Date(2012, 2, 28), new Date(2015, 2, 28)]);
		var values = [100, 300, 200, 5];
		var series = new BaseSeries();
		series.index = function () {
			return index;
		};
		series.values = function () {
			return values;
		}
		return series;		
	};

	it('can get rows', function () {
		var series = initExampleSeries();
		expect(series.rows()).to.eql([
				[new Date(1975, 2, 24), 100],
				[new Date(2015, 2, 28), 200],
		]);
	});
	
	it('can skip', function () {
		var series = initExampleSeries2();
		var skipSeries = series.skip(2);		
		expect(skipSeries.index().values()).to.eql(
			[new Date(2012, 2, 28), new Date(2015, 2, 28)]		
		);
		expect(skipSeries.values()).to.eql([200, 5]);		
	});

	it('can sort values ascending', function () {
		
		var series = initExampleSeries2();
		var sorted = series.sort(false);
		expect(sorted.index().values()).to.eql([
			new Date(2015, 2, 28),
			new Date(1975, 2, 24),
			new Date(2012, 2, 28),
			new Date(2011, 2, 28)			
		]);
		expect(sorted.values()).to.eql([5, 100, 200, 300]);
	});
	
	it('sort defaults to ascending', function () {
		
		var series = initExampleSeries2();
		var sorted = series.sort();
		expect(sorted.index().values()).to.eql([
			new Date(2015, 2, 28),
			new Date(1975, 2, 24),
			new Date(2012, 2, 28),
			new Date(2011, 2, 28)			
		]);
		expect(sorted.values()).to.eql([5, 100, 200, 300]);
	});
	
	it('can sort values descending', function () {
		
		var series = initExampleSeries2();
		var sorted = series.sort(true);
		expect(sorted.index().values()).to.eql([
			new Date(2011, 2, 28),
			new Date(2012, 2, 28),
			new Date(1975, 2, 24),
			new Date(2015, 2, 28),		
		]);
		expect(sorted.values()).to.eql([300, 200, 100, 5]);
	});
});
