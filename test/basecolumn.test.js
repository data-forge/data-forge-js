'use strict';


describe('BaseColumn', function () {
	
	var panjas = require('../index');
	var BaseColumn = require('../src/basecolumn');
	
	var expect = require('chai').expect; 
	
	var initExampleColumn = function () {
		var series = new BaseColumn();
		series.values = function () {
			return [100, 300, 200, 5];
		}
		return series;		
	};

	it('can skip', function () {
		var series = initExampleColumn();
		var skipSeries = series.skip(2);		
		expect(skipSeries.values()).to.eql([200, 5]);		
	});

	it('can sort values ascending', function () {		
		var series = initExampleColumn();
		var sorted = series.order();
		expect(sorted.values()).to.eql([5, 100, 200, 300]);
	});
	
	it('can sort values descending', function () {		
		var series = initExampleColumn();
		var sorted = series.orderDescending();
		expect(sorted.values()).to.eql([300, 200, 100, 5]);
	});
});
