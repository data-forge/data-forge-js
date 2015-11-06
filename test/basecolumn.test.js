'use strict';


describe('BaseColumn', function () {
	
	var panjas = require('../index');
	var BaseColumn = require('../src/basecolumn');
	
	var expect = require('chai').expect; 
	
	var initExampleColumn = function () {
		var column = new BaseColumn();
		column.getName = function () {
			return 'some-column';
		};
		column.getValues = function () {
			return [100, 300, 200, 5];
		};
		return column;		
	};

	it('can skip', function () {
		var column = initExampleColumn();
		var skipSeries = column.skip(2);		
		expect(skipSeries.getValues()).to.eql([200, 5]);		
	});

	it('can sort values ascending', function () {		
		var column = initExampleColumn();
		var sorted = column.order();
		expect(sorted.getValues()).to.eql([5, 100, 200, 300]);
	});
	
	it('can sort values descending', function () {		
		var column = initExampleColumn();
		var sorted = column.orderDescending();
		expect(sorted.getValues()).to.eql([300, 200, 100, 5]);
	});

	it('can get slice of rows', function () {

		var column = initExampleColumn();
		var subset = column.getRowsSubset(1, 2);
		expect(subset.getValues()).to.eql([300, 200]);
	});
});
