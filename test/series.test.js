'use strict';


describe('Series', function () {
	
	var panjas = require('../index');
	
	var expect = require('chai').expect; 
	
	var initExampleSeries = function () {
		var index = new panjas.DateIndex([new Date(1975, 2, 24), new Date(2015, 2, 28)]);
		var values = [100, 200];
		return new panjas.Series(index, values);		
	};
	
	var initExampleSeries2 = function () {
		var index = new panjas.DateIndex([new Date(1975, 2, 24), new Date(2011, 2, 28), new Date(2012, 2, 28), new Date(2015, 2, 28)]);
		var values = [100, 300, 200, 5];
		return new panjas.Series(index, values);		
	};
		
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

	it('baking series returns self', function () {
		
		var series = initExampleSeries();
		expect(series.bake()).to.equal(series);
	});

});