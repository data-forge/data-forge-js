'use strict';


describe('Series', function () {
	
	var panjas = require('../index');
	
	var expect = require('chai').expect; 
	
	var initExampleSeries = function () {
		return new panjas.Series([100, 200]);
	};
	
	var initExampleSeries2 = function () {
		return new panjas.Series(index, [100, 300, 200, 5]);
	};
		
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