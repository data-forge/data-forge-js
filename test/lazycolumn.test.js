'use strict';


describe('LazyColumn', function () {
	
	var dataForge = require('../index');
	var ArrayIterator = require('../src/iterators/array');
	
	var expect = require('chai').expect; 
	
	var initExampleColumn = function (indexFn) {
		
		var seriesFn = function () {
			var valuesFn = function () {
				return new ArrayIterator([100, 200]);
			};

			return new dataForge.LazySeries(valuesFn, indexFn);
		};

		return new dataForge.LazyColumn('some-column', seriesFn);
	};
	
	it('default index is generated', function () {
		
		var column = initExampleColumn();		
		expect(column.getSeries().getIndex().toValues()).to.eql([			
			0,
			1			
		]);		
	});

	it('can get series index', function () {
		
		var column = initExampleColumn(
			function () {
				return new dataForge.Index([5, 6])
			}
		);

		expect(column.getSeries().getIndex().toValues()).to.eql([			
			5,
			6
		]);		
	});

	it('can get series values', function () {
		
		var column = initExampleColumn();		
		expect(column.getSeries().toValues()).to.eql([			
			100,
			200			
		]);		
	});

});