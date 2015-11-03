'use strict';


describe('LazySeries', function () {
	
	var panjas = require('../index');
	
	var expect = require('chai').expect; 
	
	var initExampleColumn = function () {
		var valuesFn = function () {
			return [100, 200];
		};
		return new panjas.LazyColumn('some-column', valuesFn);
	};
	
	it('can get series values', function () {
		
		var series = initExampleColumn();		
		expect(series.values()).to.eql([			
			100,
			200			
		]);		
	});

	it('can bake lazy series', function () {
		
		var lazySeries = initExampleColumn();		
		var bakedSeries = lazySeries.bake();
		expect(lazySeries).not.to.equal(bakedSeries)
		expect(bakedSeries).to.be.an.instanceOf(panjas.Column);		
	});

});