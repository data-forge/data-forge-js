'use strict';


describe('LazyColumn', function () {
	
	var dataForge = require('../index');
	
	var expect = require('chai').expect; 
	
	var initExampleColumn = function (indexFn) {
		var valuesFn = function () {
			return [100, 200];
		};
		return new dataForge.LazyColumn('some-column', valuesFn, indexFn);
	};
	
	it('default index is generated', function () {
		
		var column = initExampleColumn();		
		expect(column.getIndex().getValues()).to.eql([			
			0,
			1			
		]);		
	});

	it('can get index', function () {
		
		var column = initExampleColumn(
			function () {
				return new dataForge.Index("__test__", [5, 6])
			}
		);
		expect(column.getIndex().getValues()).to.eql([			
			5,
			6
		]);		
	});

	it('can get series values', function () {
		
		var series = initExampleColumn();		
		expect(series.getValues()).to.eql([			
			100,
			200			
		]);		
	});

});