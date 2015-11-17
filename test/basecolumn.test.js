'use strict';


describe('BaseColumn', function () {
	
	var panjas = require('../index');
	var BaseColumn = require('../src/basecolumn');
	
	var expect = require('chai').expect; 
	var E = require('linq'); 	
	
	var initExampleColumn = function (values) {
		var column = new BaseColumn();
		column.getName = function () {
			return 'some-column';
		};
		column.getValues = function () {
			return values || [100, 300, 200, 5];
		};
		column.getIndex = function () {
			return new panjas.Index([0, 1, 2, 3]);
		};
		return column;		
	};

	it('can skip', function () {
		var column = initExampleColumn();
		var skipped = column.skip(2);		
		expect(skipped.getIndex().getValues()).to.eql([2, 3]);
		expect(skipped.getValues()).to.eql([200, 5]);		
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

	it('can get subset of rows', function () {

		var column = initExampleColumn();
		var subset = column.getRowsSubset(1, 2);
		expect(subset.getIndex().getValues()).to.eql([1, 2]);
		expect(subset.getValues()).to.eql([300, 200]);
	});

	it('can compute rolling window - from empty data set', function () {

		var column = initExampleColumn([]);
		var newColumn = column.rollingWindow(2, function (window) {
			return window;
		});

		expect(newColumn.getValues().length).to.eql(0);
	});

	it('rolling window returns 0 values when there are not enough values in the data set', function () {

		var column = initExampleColumn([1, 2]);
		var newColumn = column.rollingWindow(3, function (window) {
			return window;
		});

		expect(newColumn.getValues().length).to.eql(0);
	});

	it('can compute rolling window - odd data set with even period', function () {

		var column = initExampleColumn(E.range(0, 5).toArray());
		var newColumn = column.rollingWindow(2, function (window, index) {
			return [index, window];
		});

		var values = newColumn.getValues();
		expect(values.length).to.eql(4);
		expect(values[0]).to.eql([0, 1]);
		expect(values[1]).to.eql([1, 2]);
		expect(values[2]).to.eql([2, 3]);
		expect(values[3]).to.eql([3, 4]);
	});

	it('can compute rolling window - odd data set with odd period', function () {

		var column = initExampleColumn(E.range(0, 5).toArray());
		var newColumn = column.rollingWindow(3, function (window, index) {
			return [index, window];
		});

		var values = newColumn.getValues();
		expect(values.length).to.eql(3);
		expect(values[0]).to.eql([0, 1, 2]);
		expect(values[1]).to.eql([1, 2, 3]);
		expect(values[2]).to.eql([2, 3, 4]);
	});

	it('can compute rolling window - even data set with even period', function () {

		var column = initExampleColumn(E.range(0, 6).toArray());
		var newColumn = column.rollingWindow(2, function (window, index) {
			return [index+10, window];
		});

		var index = newColumn.getIndex().getValues();
		expect(index).to.eql([10, 11, 12, 13, 14]);

		var values = newColumn.getValues();
		expect(values.length).to.eql(5);
		expect(values[0]).to.eql([0, 1]);
		expect(values[1]).to.eql([1, 2]);
		expect(values[2]).to.eql([2, 3]);
		expect(values[3]).to.eql([3, 4]);
		expect(values[4]).to.eql([4, 5]);
	});

	it('can compute rolling window - even data set with odd period', function () {

		var column = initExampleColumn(E.range(0, 6).toArray());
		var newColumn = column.rollingWindow(3, function (window, index) {
			return [index, window];
		});

		var values = newColumn.getValues();
		expect(values.length).to.eql(4);
		expect(values[0]).to.eql([0, 1, 2]);
		expect(values[1]).to.eql([1, 2, 3]);
		expect(values[2]).to.eql([2, 3, 4]);
		expect(values[3]).to.eql([3, 4, 5]);
	});

	it('can reindex column', function () {

		var column = initExampleColumn();
		var newIndex = new panjas.Index([3, 10, 1, 32])

		var reindexed = column.reindex(newIndex);
		expect(reindexed.getIndex().getValues()).to.eql([3, 10, 1, 32]);
		expect(reindexed.getValues()).to.eql([5, undefined, 300, undefined]);
	});
});
