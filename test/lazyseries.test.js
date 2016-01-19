'use strict';


describe('LazySeries', function () {
	
	var dataForge = require('../index');
	var ArrayIterator = require('../src/iterators/array');
	
	var expect = require('chai').expect; 
	
	var initExampleSeries = function (indexFn) {
		var valuesFn = function () {
			return new ArrayIterator([100, 200]);
		};
		return new dataForge.LazySeries(valuesFn, indexFn);
	};
	
	it('default index is generated', function () {
		
		var series = initExampleSeries();		
		expect(series.getIndex().toValues()).to.eql([			
			0,
			1			
		]);		
	});

	it('can get index', function () {
		
		var series = initExampleSeries(
			function () {
				return new dataForge.Index([5, 6])
			}
		);
		expect(series.getIndex().toValues()).to.eql([			
			5,
			6
		]);		
	});

	it('can get series values', function () {
		
		var series = initExampleSeries();		
		expect(series.toValues()).to.eql([			
			100,
			200			
		]);		
	});

});