'use strict';


describe('BaseColumn', function () {
	
	var dataForge = require('../index');
	var BaseColumn = require('../src/basecolumn');
	
	var expect = require('chai').expect; 
	var assert = require('chai').assert; 
	var E = require('linq'); 	

	var initColumn = function (index, values) {
		assert.isArray(index);
		assert.isArray(values);

		var column = new BaseColumn();
		column.getName = function () {
			return 'some-column';
		};
		column.getValues = function () {
			return values;
		};
		column.getIndex = function () {
			return new dataForge.Index("__test__", index);
		};
		return column;		
	};
	
	it('can skip', function () {
		var column = initColumn([0, 1, 2, 3], [100, 300, 200, 5]);
		var skipped = column.skip(2);		
		expect(skipped.getIndex().getValues()).to.eql([2, 3]);
		expect(skipped.getValues()).to.eql([200, 5]);		
	});

	it('can take', function () {
		var column = initColumn([0, 1, 2, 3], [100, 300, 200, 5]);
		var skipped = column.take(2);		
		expect(skipped.getIndex().getValues()).to.eql([0, 1]);
		expect(skipped.getValues()).to.eql([100, 300]);		
	});

	it('can filter', function () {
		var column = initColumn([0, 1, 2, 3], [100, 300, 200, 5]);
		var filtered = column.where(function (value) {
				return value >= 100 && value < 300;
			});
		expect(filtered.getIndex().getValues()).to.eql([0, 2]);
		expect(filtered.getValues()).to.eql([100, 200]);		
	});

	it('can select', function () {
		var column = initColumn([0, 1, 2, 3], [100, 300, 200, 5]);
		var modified = column.select(function (value) {
				return value + 10;
			});
		expect(modified.getIndex().getValues()).to.eql([0, 1, 2, 3]);
		expect(modified.getValues()).to.eql([110, 310, 210, 15]);		
	});

	it('can select many', function () {
		var column = initColumn([0, 1, 2, 3], [100, 300, 200, 5]);
		var modified = column.selectMany(function (value) {
				return E.range(0, 2)
					.select(function (i) {
						return value + i + 1;
					})
					.toArray();
			});
		expect(modified.getIndex().getValues()).to.eql([0, 0, 1, 1, 2, 2, 3, 3]);
		expect(modified.getValues()).to.eql([101, 102, 301, 302, 201, 202, 6, 7]);		
	});

	it('can sort values ascending', function () {		
		var column = initColumn([0, 1, 2, 3], [100, 300, 200, 5]);
		var sorted = column.order();
		expect(sorted.getIndex().getValues()).to.eql([3, 0, 2, 1]);
		expect(sorted.getValues()).to.eql([5, 100, 200, 300]);
	});
	
	it('can sort values descending', function () {		
		var column = initColumn([0, 1, 2, 3], [100, 300, 200, 5]);
		var sorted = column.orderDescending();
		expect(sorted.getIndex().getValues()).to.eql([1, 2, 0, 3]);
		expect(sorted.getValues()).to.eql([300, 200, 100, 5]);
	});

	it('can sort nested objects using selector - ascending', function () {
		var column = initColumn(
			[0, 1, 2, 3], 
			[
				{
					i: 1,
					v: 300,
				},
				{
					i: 2,
					v: 100,
				},
				{
					i: 0,
					v: 100,
				},
				{
					i: 3,
					v: 5
				}
			]
		);
		var sorted = column
			.orderBy(function (row) {
				return row.v;
			})
			.thenBy(function (row) {
				return row.i;
			});
		expect(sorted.getIndex().getValues()).to.eql([3, 2, 1, 0]);
		expect(sorted.getValues()).to.eql([
			{
				i: 3,
				v: 5
			},
			{
				i: 0,
				v: 100,
			},
			{
				i: 2,
				v: 100,
			},
			{
				i: 1,
				v: 300,
			},
		]);
	});

	it('can sort nested objects using selector - descending', function () {
		var column = initColumn(
			[0, 1, 2, 3], 
			[
				{
					i: 1,
					v: 300,
				},
				{
					i: 2,
					v: 100,
				},
				{
					i: 0,
					v: 100,
				},
				{
					i: 3,
					v: 5
				}
			]
		);
		var sorted = column
			.orderByDescending(function (row) {
				return row.v;
			})
			.thenByDescending(function (row) {
				return row.i;
			});
		expect(sorted.getIndex().getValues()).to.eql([0, 1, 2, 3]);
		expect(sorted.getValues()).to.eql([
			{
				i: 1,
				v: 300,
			},
			{
				i: 2,
				v: 100,
			},
			{
				i: 0,
				v: 100,
			},
			{
				i: 3,
				v: 5
			},
		]);
	});


	it('can get subset of rows', function () {

		var column = initColumn([0, 1, 2, 3], [100, 300, 200, 5]);
		var subset = column.getRowsSubset(1, 2);
		expect(subset.getIndex().getValues()).to.eql([1, 2]);
		expect(subset.getValues()).to.eql([300, 200]);
	});

	it('can compute rolling window - from empty data set', function () {

		var column = initColumn([], []);
		var newColumn = column.rollingWindow(2, function (index, values, rowIndex) {
			return [rowIndex, values];
		});

		expect(newColumn.getValues().length).to.eql(0);
	});

	it('rolling window returns 0 values when there are not enough values in the data set', function () {

		var column = initColumn([0, 1], [1, 2]);
		var newColumn = column.rollingWindow(3, function (index, values, rowIndex) {
			return [rowIndex, values];
		});

		expect(newColumn.getValues().length).to.eql(0);
	});

	it('can compute rolling window - odd data set with even period', function () {

		var column = initColumn(E.range(0, 5).toArray(), E.range(0, 5).toArray());
		var newColumn = column.rollingWindow(2, function (index, values, rowIndex) {
			return [rowIndex, values];
		});

		var index = newColumn.getIndex().getValues();
		expect(index).to.eql([0, 1, 2, 3]);

		var values = newColumn.getValues();
		expect(values.length).to.eql(4);
		expect(values[0]).to.eql([0, 1]);
		expect(values[1]).to.eql([1, 2]);
		expect(values[2]).to.eql([2, 3]);
		expect(values[3]).to.eql([3, 4]);
	});

	it('can compute rolling window - odd data set with odd period', function () {

		var column = initColumn(E.range(0, 5).toArray(), E.range(0, 5).toArray());
		var newColumn = column.rollingWindow(3, function (index, values, rowIndex) {
			return [rowIndex, values];
		});

		var index = newColumn.getIndex().getValues();
		expect(index).to.eql([0, 1, 2]);

		var values = newColumn.getValues();
		expect(values.length).to.eql(3);
		expect(values[0]).to.eql([0, 1, 2]);
		expect(values[1]).to.eql([1, 2, 3]);
		expect(values[2]).to.eql([2, 3, 4]);
	});

	it('can compute rolling window - even data set with even period', function () {

		var column = initColumn(E.range(0, 6).toArray(), E.range(0, 6).toArray());
		var newColumn = column.rollingWindow(2, function (index, values, rowIndex) {
			return [rowIndex+10, values];
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

		var column = initColumn(E.range(0, 6).toArray(), E.range(0, 6).toArray());
		var newColumn = column.rollingWindow(3, function (index, values, rowIndex) {
			return [rowIndex, values];
		});

		var index = newColumn.getIndex().getValues();
		expect(index).to.eql([0, 1, 2, 3]);

		var values = newColumn.getValues();
		expect(values.length).to.eql(4);
		expect(values[0]).to.eql([0, 1, 2]);
		expect(values[1]).to.eql([1, 2, 3]);
		expect(values[2]).to.eql([2, 3, 4]);
		expect(values[3]).to.eql([3, 4, 5]);
	});

	it('can compute rolling window - can take last index and value from each window', function () {

		var column = initColumn(E.range(0, 6).toArray(), E.range(0, 6).toArray());
		var newColumn = column.rollingWindow(3, function (index, values, rowIndex) {
			return [index[index.length-1], values[values.length-1]];
		});

		var index = newColumn.getIndex().getValues();
		expect(index).to.eql([2, 3, 4, 5]);

		var values = newColumn.getValues();
		expect(values).to.eql([2, 3, 4, 5]);
	});

	it('can reindex column', function () {

		var column = initColumn([0, 1, 2, 3], [100, 300, 200, 5]);
		var newIndex = new dataForge.Index("__test__", [3, 10, 1, 32])

		var reindexed = column.reindex(newIndex);
		expect(reindexed.getIndex().getValues()).to.eql([3, 10, 1, 32]);
		expect(reindexed.getValues()).to.eql([5, undefined, 300, undefined]);
	});

	it('reindexing a column with duplicate indicies throws', function () {

		var column = initColumn([0, 1, 1, 3], [100, 300, 200, 5]);
		var newIndex = new dataForge.Index("__test__", [3, 10, 1, 32])

		var reindexed = column.reindex(newIndex);

		expect(function () {
			reindexed.getValues(); // Force lazy evaluation to complete.
			
		}).to.throw(Error);
	});

	it('can compute pct changed', function () {

		var column = initColumn([0, 1, 2, 3], [1, 2, 4, 8]);
		var pctChanged = column.percentChange();
		expect(pctChanged.getIndex().getValues()).to.eql([1, 2, 3]);
		expect(pctChanged.getValues()).to.eql([1, 1, 1]);
	});

	//todo: what happens when parsing floats as int?
	//todo: what should happen when running parseInt on a non string column?

	it('can parse string column to int', function () {

		var column = initColumn([10, 5, 2], ['1', '100', '5']);
		var parsed = column.parseInts();

		expect(parsed.getIndex().getValues()).to.eql([10, 5, 2]);
		expect(parsed.getValues()).to.eql([1, 100, 5]);
	});

	it('can parse string column to int - with empty string', function () {

		var column = initColumn([10], ['']);
		var parsed = column.parseInts();

		expect(parsed.getIndex().getValues()).to.eql([10]);
		expect(parsed.getValues()).to.eql([undefined]);
	});

	it('can parse string column to int - with undefined', function () {

		var column = initColumn([10], [undefined]);
		var parsed = column.parseInts();

		expect(parsed.getIndex().getValues()).to.eql([10]);
		expect(parsed.getValues()).to.eql([undefined]);
	});

	it('can parse string column to int - throws when source value is not a string', function () {

		var column = initColumn([10], [5]);
		var parsed = column.parseInts();

		expect(parsed.getIndex().getValues()).to.eql([10]);
		expect(function () { 
			parsed.getValues();
		}).to.throw();
	});

	it('can parse string column to float', function () {

		var column = initColumn([10, 5, 2], ['1', '100.2020', '5.5']);
		var parsed = column.parseFloats();

		expect(parsed.getIndex().getValues()).to.eql([10, 5, 2]);
		expect(parsed.getValues()).to.eql([1, 100.2020, 5.5]);
	});

	it('can parse string column to float - with empty string', function () {

		var column = initColumn([10], ['']);
		var parsed = column.parseFloats();

		expect(parsed.getIndex().getValues()).to.eql([10]);
		expect(parsed.getValues()).to.eql([undefined]);
	});

	it('can parse string column to float - with undefined', function () {

		var column = initColumn([10], [undefined]);
		var parsed = column.parseFloats();

		expect(parsed.getIndex().getValues()).to.eql([10]);
		expect(parsed.getValues()).to.eql([undefined]);
	});

	it('can parse string column to float - throws when source value is not a string', function () {

		var column = initColumn([10], [5]);
		var parsed = column.parseFloats();

		expect(parsed.getIndex().getValues()).to.eql([10]);
		expect(function () { 
			parsed.getValues();
		}).to.throw();
	});

	it('can parse string column to date', function () {

		var column = initColumn([10, 5], ['1975-2-24', '2015-2-24']);
		var parsed = column.parseDates();

		expect(parsed.getIndex().getValues()).to.eql([10, 5]);
		expect(parsed.getValues()).to.eql([new Date(1975, 1, 24), new Date(2015, 1, 24)]); // Note months are 0-based here.
	});

	it('can parse string column to date - with empty string', function () {

		var column = initColumn([10], ['']);
		var parsed = column.parseDates();

		expect(parsed.getIndex().getValues()).to.eql([10]);
		expect(parsed.getValues()).to.eql([undefined]);
	});

	it('can parse string column to date - with undefined', function () {

		var column = initColumn([10], [undefined]);
		var parsed = column.parseDates();

		expect(parsed.getIndex().getValues()).to.eql([10]);
		expect(parsed.getValues()).to.eql([undefined]);
	});

	it('can parse string column to date - throws when source value is not a string', function () {

		var column = initColumn([10], [5]);
		var parsed = column.parseDates();

		expect(parsed.getIndex().getValues()).to.eql([10]);
		expect(function () { 
			parsed.getValues();
		}).to.throw();
	});

	it('can parse values to strings', function () {

		var column = initColumn([1, 2, 3, 4, 5, 6], [1, null, undefined, "foo", 5.5, new Date(2015, 1, 1)]);
		var converted = column.toStrings();

		expect(converted.getIndex().getValues()).to.eql([1, 2, 3, 4, 5, 6]);
		expect(converted.getValues()).to.eql([
			'1', 
			null, 
			undefined, 
			"foo", 
			'5.5', 
			'Sun Feb 01 2015 00:00:00 GMT+1000 (E. Australia Standard Time)'
		]);

	});

	it('can detect actual column type', function () {

		var column = initColumn([1], [1]);
		var types = column.detectTypes();
		expect(types.getIndex().getValues()).to.eql(['type', 'frequency']);
		expect(types.getValues()).to.eql([
			['number', 100]
		]);
	});

	it('can detect date column type', function () {

		var column = initColumn([1], [new Date(2015, 1, 1)]);
		var types = column.detectTypes();
		expect(types.getIndex().getValues()).to.eql(['type', 'frequency']);
		expect(types.getValues()).to.eql([
			['date', 100]
		]);
	});

	it('can detect multiple column types', function () {

		var column = initColumn([1, 2], [1, 'foo']);
		var types = column.detectTypes();
		expect(types.getIndex().getValues()).to.eql(['type', 'frequency']);
		expect(types.getValues()).to.eql([
			['number', 50],
			['string', 50],
		]);

	});

});
