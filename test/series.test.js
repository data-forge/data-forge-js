'use strict';


describe('Series', function () {
	
	var dataForge = require('../index');
	var Series = require('../src/series');
	var ArrayIterator = require('../src/iterators/array');
	var moment = require('moment');
	
	var expect = require('chai').expect; 
	var assert = require('chai').assert; 
	var E = require('linq'); 	

	var initSeries = function (index, values) {
		assert.isArray(index);
		assert.isArray(values);

		return new Series({
			values: values,
			index: new dataForge.Index(index),
		});
	};

	it('default index is generated', function () {
		
		var column = new dataForge.Series({ values: [100, 200] });
		expect(column.getIndex().toValues()).to.eql([			
			0,
			1			
		]);		
	});

	it('can get index', function () {
		
		var column = new dataForge.Series({ values: [100, 200], index: new dataForge.Index([5, 6]) });
		expect(column.getIndex().toValues()).to.eql([
			5,
			6
		]);		
	});
	
	it('can get column values', function () {
		
		var column = new dataForge.Series({ values: [100, 200] });
		expect(column.toValues()).to.eql([			
			100,
			200			
		]);		
	});

	it('can specify values as an iterable', function () {
		
		var iterable = function () {
			return new ArrayIterator([100, 200]);
		};
		var column = new dataForge.Series({ values: iterable });
		expect(column.toValues()).to.eql([			
			100,
			200			
		]);		
	});

	it('can bake values from enumerator', function () {

		var series = initSeries([0, 1, 2, 3], [100, 300, 200, 5]);
		expect(series.toValues()).to.eql([100, 300, 200, 5]);
	});	

	it('can skip', function () {
		var series = initSeries([0, 1, 2, 3], [100, 300, 200, 5]);
		var skipped = series.skip(2);		
		expect(skipped.getIndex().toValues()).to.eql([2, 3]);
		expect(skipped.toValues()).to.eql([200, 5]);		
	});

	it('can take', function () {
		var series = initSeries([0, 1, 2, 3], [100, 300, 200, 5]);
		var skipped = series.take(2);		
		expect(skipped.getIndex().toValues()).to.eql([0, 1]);
		expect(skipped.toValues()).to.eql([100, 300]);		
	});

	it('can filter', function () {
		var series = initSeries([0, 1, 2, 3], [100, 300, 200, 5]);
		var filtered = series.where(function (value) {
				return value >= 100 && value < 300;
			});
		expect(filtered.getIndex().toValues()).to.eql([0, 2]);
		expect(filtered.toValues()).to.eql([100, 200]);		
	});

	it('can select', function () {
		var series = initSeries([0, 1, 2, 3], [100, 300, 200, 5]);
		var modified = series.select(function (value) {
				return value + 10;
			});
		expect(modified.getIndex().toValues()).to.eql([0, 1, 2, 3]);
		expect(modified.toValues()).to.eql([110, 310, 210, 15]);		
	});

	it('can select many', function () {
		var series = initSeries([0, 1, 2, 3], [100, 300, 200, 5]);
		var modified = series.selectMany(function (value) {
				return E.range(0, 2)
					.select(function (i) {
						return value + i + 1;
					})
					.toArray();
			});
		expect(modified.getIndex().toValues()).to.eql([0, 0, 1, 1, 2, 2, 3, 3]);
		expect(modified.toValues()).to.eql([101, 102, 301, 302, 201, 202, 6, 7]);		
	});

	it('can sort values ascending', function () {		
		var series = initSeries([0, 1, 2, 3], [100, 300, 200, 5]);
		var sorted = series.order();
		expect(sorted.getIndex().toValues()).to.eql([3, 0, 2, 1]);
		expect(sorted.toValues()).to.eql([5, 100, 200, 300]);
	});
	
	it('can sort values descending', function () {		
		var series = initSeries([0, 1, 2, 3], [100, 300, 200, 5]);
		var sorted = series.orderDescending();
		expect(sorted.getIndex().toValues()).to.eql([1, 2, 0, 3]);
		expect(sorted.toValues()).to.eql([300, 200, 100, 5]);
	});

	it('can sort nested objects using selector - ascending', function () {
		var series = initSeries(
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
		var sorted = series
			.orderBy(function (row) {
				return row.v;
			})
			.thenBy(function (row) {
				return row.i;
			});
		expect(sorted.getIndex().toValues()).to.eql([3, 2, 1, 0]);
		expect(sorted.toValues()).to.eql([
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
		var series = initSeries(
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
		var sorted = series
			.orderByDescending(function (row) {
				return row.v;
			})
			.thenByDescending(function (row) {
				return row.i;
			});
		expect(sorted.getIndex().toValues()).to.eql([0, 1, 2, 3]);
		expect(sorted.toValues()).to.eql([
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


	it('can get slice of rows', function () {

		var series = initSeries([0, 1, 2, 3], [100, 300, 200, 5]);
		var slice = series.slice(1, 3);
		expect(slice.toPairs()).to.eql([
			[1, 300],
			[2, 200],
		]);
	});

	it('can get slice of rows with explict predicates', function () {

		var series = initSeries([0, 1, 2, 3], [100, 300, 200, 5]);
		var slice = series.slice(
			function (indexValue) {
				return indexValue < 1;
			},
			function (indexValue) {
				return indexValue < 3;
			}
		);

		expect(slice.toPairs()).to.eql([
			[1, 300],
			[2, 200],
		]);
	});

	it('can get slice of rows from time series', function () {

		var series = initSeries([new Date(2016, 1, 1), new Date(2016, 1, 3), new Date(2016, 1, 5), new Date(2016, 1, 10)], [0, 1, 2, 3]);
		var slice = series.slice(new Date(2016, 1, 2), new Date(2016, 1, 8),
			function (a, b) {
				return moment(a).isBefore(b);
			}
		);
		expect(slice.toPairs()).to.eql([
			[new Date(2016, 1, 3), 1],
			[new Date(2016, 1, 5), 2],
		]);
	});

	it('can compute window - creates an empty series from an empty data set', function () {

		var series = new Series();
		var windowed = series.window(2, function (window, windowIndex) {
			return [windowIndex, window.sum()];
		});

		expect(windowed.count()).to.eql(0);
	});

	it('can compute window - with even window size and even number of rows', function () {

		var series = new Series({ values: [1, 2, 3, 4] });
		var windowed = series.window(2, function (window, windowIndex) {
			return [windowIndex, window.toValues()];
		});

		expect(windowed.toPairs()).to.eql([
			[0, [1, 2]],
			[1, [3, 4]],
		]);
	});

	it('can compute window - with even window size and odd number of rows', function () {

		var series = new Series({ values: [1, 2, 3, 4, 5] });
		var windowed = series.window(2, function (window, windowIndex) {
			return [windowIndex, window.toValues()];
		});

		expect(windowed.toPairs()).to.eql([
			[0, [1, 2]],
			[1, [3, 4]],
			[2, [5]],
		]);
	});

	it('can compute window - with odd window size and odd number of rows', function () {

		var series = new Series({ values: [1, 2, 3, 4, 5, 6] });
		var windowed = series.window(3, function (window, windowIndex) {
			return [windowIndex, window.toValues()];
		});

		expect(windowed.toPairs()).to.eql([
			[0, [1, 2, 3]],
			[1, [4, 5, 6]],
		]);

	});

	it('can compute window - with odd window size and even number of rows', function () {

		var series = new Series({ values: [1, 2, 3, 4, 5] });
		var windowed = series.window(3, function (window, windowIndex) {
			return [windowIndex, window.toValues()];
		});

		expect(windowed.toPairs()).to.eql([
			[0, [1, 2, 3]],
			[1, [4, 5]],
		]);

	});

	it('can compute rolling window - from empty data set', function () {

		var series = initSeries([], []);
		var newSeries = series.rollingWindow(2, function (window, windowIndex) {
			return [windowIndex, window.toValues()];
		});

		expect(newSeries.toValues().length).to.eql(0);
	});

	it('rolling window returns 0 values when there are not enough values in the data set', function () {

		var series = initSeries([0, 1], [1, 2]);
		var newSeries = series.rollingWindow(3, function (window, windowIndex) {
			return [windowIndex, window.toValues()];
		});

		expect(newSeries.toValues().length).to.eql(0);
	});

	it('can compute rolling window - odd data set with even period', function () {

		var series = initSeries(E.range(0, 5).toArray(), E.range(0, 5).toArray());
		var newSeries = series.rollingWindow(2, function (window, windowIndex) {
			return [windowIndex, window.toValues()];
		});

		var index = newSeries.getIndex().toValues();
		expect(index).to.eql([0, 1, 2, 3]);

		var values = newSeries.toValues();
		expect(values.length).to.eql(4);
		expect(values[0]).to.eql([0, 1]);
		expect(values[1]).to.eql([1, 2]);
		expect(values[2]).to.eql([2, 3]);
		expect(values[3]).to.eql([3, 4]);
	});

	it('can compute rolling window - odd data set with odd period', function () {

		var series = initSeries(E.range(0, 5).toArray(), E.range(0, 5).toArray());
		var newSeries = series.rollingWindow(3, function (window, windowIndex) {
			return [windowIndex, window.toValues()];
		});

		var index = newSeries.getIndex().toValues();
		expect(index).to.eql([0, 1, 2]);

		var values = newSeries.toValues();
		expect(values.length).to.eql(3);
		expect(values[0]).to.eql([0, 1, 2]);
		expect(values[1]).to.eql([1, 2, 3]);
		expect(values[2]).to.eql([2, 3, 4]);
	});

	it('can compute rolling window - even data set with even period', function () {

		var series = initSeries(E.range(0, 6).toArray(), E.range(0, 6).toArray());
		var newSeries = series.rollingWindow(2, function (window, windowIndex) {
			return [windowIndex+10, window.toValues()];
		});

		var index = newSeries.getIndex().toValues();
		expect(index).to.eql([10, 11, 12, 13, 14]);

		var values = newSeries.toValues();
		expect(values.length).to.eql(5);
		expect(values[0]).to.eql([0, 1]);
		expect(values[1]).to.eql([1, 2]);
		expect(values[2]).to.eql([2, 3]);
		expect(values[3]).to.eql([3, 4]);
		expect(values[4]).to.eql([4, 5]);
	});

	it('can compute rolling window - even data set with odd period', function () {

		var series = initSeries(E.range(0, 6).toArray(), E.range(0, 6).toArray());
		var newSeries = series.rollingWindow(3, function (window, windowIndex) {
			return [windowIndex, window.toValues()];
		});

		var index = newSeries.getIndex().toValues();
		expect(index).to.eql([0, 1, 2, 3]);

		var values = newSeries.toValues();
		expect(values.length).to.eql(4);
		expect(values[0]).to.eql([0, 1, 2]);
		expect(values[1]).to.eql([1, 2, 3]);
		expect(values[2]).to.eql([2, 3, 4]);
		expect(values[3]).to.eql([3, 4, 5]);
	});

	it('can compute rolling window - can take last index and value from each window', function () {

		var series = initSeries(E.range(0, 6).toArray(), E.range(0, 6).toArray());
		var newSeries = series.rollingWindow(3, function (window, windowIndex) {
			var index = window.getIndex().toValues();
			var values = window.toValues();
			return [index[index.length-1], values[values.length-1]];
		});

		var index = newSeries.getIndex().toValues();
		expect(index).to.eql([2, 3, 4, 5]);

		var values = newSeries.toValues();
		expect(values).to.eql([2, 3, 4, 5]);
	});

	it('can reindex series', function () {

		var series = initSeries([0, 1, 2, 3], [100, 300, 200, 5]);
		var newIndex = new dataForge.Index([3, 10, 1, 32])

		var reindexed = series.reindex(newIndex);
		expect(reindexed.getIndex().toValues()).to.eql([3, 10, 1, 32]);
		expect(reindexed.toValues()).to.eql([5, undefined, 300, undefined]);
	});

	it('reindexing a series with duplicate indicies throws', function () {

		var series = initSeries([0, 1, 1, 3], [100, 300, 200, 5]);
		var newIndex = new dataForge.Index([3, 10, 1, 32])

		var reindexed = series.reindex(newIndex);

		expect(function () {
			reindexed.toValues(); // Force lazy evaluation to complete.
			
		}).to.throw(Error);
	});

	it('can compute pct changed', function () {

		var series = initSeries([0, 1, 2, 3], [1, 2, 4, 8]);
		var pctChanged = series.percentChange();
		expect(pctChanged.getIndex().toValues()).to.eql([1, 2, 3]);
		expect(pctChanged.toValues()).to.eql([1, 1, 1]);
	});

	it('can parse string series to int', function () {

		var series = initSeries([10, 5, 2], ['1', '100', '5']);
		var parsed = series.parseInts();

		expect(parsed.getIndex().toValues()).to.eql([10, 5, 2]);
		expect(parsed.toValues()).to.eql([1, 100, 5]);
	});

	it('can parse string series to int - with empty string', function () {

		var series = initSeries([10], ['']);
		var parsed = series.parseInts();

		expect(parsed.getIndex().toValues()).to.eql([10]);
		expect(parsed.toValues()).to.eql([undefined]);
	});

	it('can parse string series to int - with undefined', function () {

		var series = initSeries([10], [undefined]);
		var parsed = series.parseInts();

		expect(parsed.getIndex().toValues()).to.eql([10]);
		expect(parsed.toValues()).to.eql([undefined]);
	});

	it('can parse string series to int - throws when source value is not a string', function () {

		var series = initSeries([10], [5]);
		var parsed = series.parseInts();

		expect(function () { 
			parsed.toValues();
		}).to.throw();
	});

	it('can parse string series to float', function () {

		var series = initSeries([10, 5, 2], ['1', '100.2020', '5.5']);
		var parsed = series.parseFloats();

		expect(parsed.getIndex().toValues()).to.eql([10, 5, 2]);
		expect(parsed.toValues()).to.eql([1, 100.2020, 5.5]);
	});

	it('can parse string series to float - with empty string', function () {

		var series = initSeries([10], ['']);
		var parsed = series.parseFloats();

		expect(parsed.getIndex().toValues()).to.eql([10]);
		expect(parsed.toValues()).to.eql([undefined]);
	});

	it('can parse string series to float - with undefined', function () {

		var series = initSeries([10], [undefined]);
		var parsed = series.parseFloats();

		expect(parsed.getIndex().toValues()).to.eql([10]);
		expect(parsed.toValues()).to.eql([undefined]);
	});

	it('can parse string series to float - throws when source value is not a string', function () {

		var series = initSeries([10], [5]);
		var parsed = series.parseFloats();

		expect(function () { 
			parsed.toValues();
		}).to.throw();
	});

	it('can parse string series to date', function () {

		var series = initSeries([10, 5], ['1975-2-24', '2015-2-24']);
		var parsed = series.parseDates();

		expect(parsed.getIndex().toValues()).to.eql([10, 5]);
		expect(parsed.toValues()).to.eql([new Date(1975, 1, 24), new Date(2015, 1, 24)]); // Note months are 0-based here.
	});

	it('can parse string series to date - with empty string', function () {

		var series = initSeries([10], ['']);
		var parsed = series.parseDates();

		expect(parsed.getIndex().toValues()).to.eql([10]);
		expect(parsed.toValues()).to.eql([undefined]);
	});

	it('can parse string series to date - with undefined', function () {

		var series = initSeries([10], [undefined]);
		var parsed = series.parseDates();

		expect(parsed.getIndex().toValues()).to.eql([10]);
		expect(parsed.toValues()).to.eql([undefined]);
	});

	it('can parse string series to date - throws when source value is not a string', function () {

		var series = initSeries([10], [5]);
		var parsed = series.parseDates();

		expect(function () { 
			parsed.toValues();
		}).to.throw();
	});

	it('can parse string series to date - with format string', function () {

		var series = initSeries([10, 5], ['24-02-75', '24-02-15']);
		var parsed = series.parseDates('DD-MM-YY');

		expect(parsed.getIndex().toValues()).to.eql([10, 5]);
		expect(parsed.toValues()).to.eql([new Date(1975, 1, 24), new Date(2015, 1, 24)]); // Note months are 0-based here.
	});

	it('can parse values to strings', function () {

		var series = initSeries([1, 2, 3, 4, 5, 6], [1, null, undefined, "foo", 5.5, new Date(2015, 1, 1)]);
		var converted = series.toStrings();

		expect(converted.getIndex().toValues()).to.eql([1, 2, 3, 4, 5, 6]);
		expect(converted.toValues()).to.eql([
			'1', 
			null, 
			undefined, 
			"foo", 
			'5.5', 
			'Sun Feb 01 2015 00:00:00 GMT+1000 (E. Australia Standard Time)'
		]);

	});

	it('can specify format string for date series', function () {

		var series = initSeries([1], [new Date(2015, 1, 3)]);
		var converted = series.toStrings('YYYY-DD-MM');

		expect(converted.getIndex().toValues()).to.eql([1]);
		expect(converted.toValues()).to.eql([
			'2015-03-02',
		]);
	});

	it('can specify format string for date series - with moment', function () {

		var series = initSeries([1], [moment(new Date(2015, 1, 3))]);
		var converted = series.toStrings('YYYY-DD-MM');

		expect(converted.getIndex().toValues()).to.eql([1]);
		expect(converted.toValues()).to.eql([
			'2015-03-02',
		]);
	});

	it('can detect actual series type', function () {

		var series = initSeries([1], [1]);
		var types = series.detectTypes();
		expect(types.getColumnNames()).to.eql(['Type', 'Frequency']);
		expect(types.getIndex().toValues()).to.eql([0]);
		expect(types.toValues()).to.eql([
			['number', 100]
		]);
	});

	it('can detect date series type', function () {

		var series = initSeries([1], [new Date(2015, 1, 1)]);
		var types = series.detectTypes();
		expect(types.getColumnNames()).to.eql(['Type', 'Frequency']);
		expect(types.getIndex().toValues()).to.eql([0]);
		expect(types.toValues()).to.eql([
			['date', 100]
		]);
	});

	it('can detect multiple series types', function () {

		var series = initSeries([1, 2], [1, 'foo']);
		var types = series.detectTypes();
		expect(types.getColumnNames()).to.eql(['Type', 'Frequency']);
		expect(types.getIndex().toValues()).to.eql([0, 1]);
		expect(types.toValues()).to.eql([
			['number', 50],
			['string', 50],
		]);
	});

	it('can detect values', function () {
		var series = initSeries([1, 2], [1, 'foo']);
		var values = series.detectValues();
		expect(values.getColumnNames()).to.eql(['Value', 'Frequency']);
		expect(values.getIndex().toValues()).to.eql([0, 1]);
		expect(values.toValues()).to.eql([
			[1, 50],
			['foo', 50],
		]);
	});

	it('can truncate string values', function () {

		var series = initSeries([1, 2], ['foo', 'bar']);
		var truncated = series.truncateStrings(2);

		expect(truncated.getIndex().toValues()).to.eql([1, 2]);
		expect(truncated.toValues()).to.eql(['fo', 'ba']);
	});

	it('truncation ignores strings that are already short enough', function () {

		var series = initSeries([1, 2], ['foo', 'bar']);
		var truncated = series.truncateStrings(20);

		expect(truncated.toValues()).to.eql(['foo', 'bar']);
	});

	it('truncation passes through other values', function () {

		var series = initSeries([1, 2, 3, 4], [null, undefined, 1, new Date(2015, 1, 1)]);
		var truncated = series.truncateStrings(20);

		expect(truncated.toValues()).to.eql([null, undefined, 1, new Date(2015, 1, 1)]);
	});

	it('can bake series', function () {

		var indicies = [1, 2];
		var values = ['foo', 'bar'];
		var series = initSeries(indicies, values);
		var baked = series.bake();

		expect(baked).not.to.equal(series);
		expect(baked).to.be.an.instanceOf(dataForge.Series);
		expect(baked.getIndex()).to.be.an.instanceOf(dataForge.Index);
		expect(baked.getIndex().toValues()).to.eql(indicies);
		expect(baked.toValues()).to.eql(values);
	});

	it('can get pairs', function () {
		var indicies = [1, 2];
		var values = ['foo', 'bar'];
		var series = initSeries(indicies, values);		

		expect(series.toPairs()).to.eql([
				[1, 'foo'],
				[2, 'bar'],
			]);
	});

	it('can get size', function () {

		var indicies = [1, 2];
		var values = ['foo', 'bar'];
		var series = initSeries(indicies, values);		
		expect(series.count()).to.eql(values.length);
	})

	it('getting first row of empty series throws exception', function () {

		var series = initSeries([], []);

		expect(function () {
			series.first();
		}).to.throw();
	});

	it('getting last row of empty series throws exception', function () {

		var series = initSeries([], []);

		expect(function () {
			series.last();
		}).to.throw();
	});

	it('can get first and last rows', function () {

		var series = initSeries([0, 1, 2], ['A', 'B', 'C']);

		expect(series.first()).to.eql('A');
		expect(series.last()).to.eql('C');
	});

	it('can reverse', function () {

		var series = initSeries([0, 1, 2], ['A', 'B', 'C']);
		var reversed = series.reverse();
		expect(series.toValues()).to.eql(['A', 'B', 'C']);
		expect(series.getIndex().toValues()).to.eql([0, 1, 2]);
		expect(reversed.toValues()).to.eql(['C', 'B', 'A']);
		expect(reversed.getIndex().toValues()).to.eql([2, 1, 0]);
	});

	it('can inflate series to data frame', function () {

		var series = initSeries([0, 1, 2], ['A', 'B', 'C']);
		var dataFrame = series.inflate(function (value) {
				return {
					Col1: value,
					Col2: value + value,
				};
			});

		expect(dataFrame.getColumnNames()).to.eql(["Col1", "Col2"]);
		expect(dataFrame.toValues()).to.eql([
			['A', 'AA'],
			['B', 'BB'],
			['C', 'CC'],
		]);

	});

	it('inflate has a default selector that expands the columns in an object', function () {

		var series = initSeries([0, 1], [
			{
				A: 1,
				B: 2,
			},	
			{
				A: 3,
				B: 4,
			},	
		]);
		var dataFrame = series.inflate();

		expect(dataFrame.getColumnNames()).to.eql(["A", "B"]);
		expect(dataFrame.toValues()).to.eql([
			[1, 2],
			[3, 4],
		]);

	});

	it('can get head of series', function () {

		var series = initSeries([0, 1, 2], ['A', 'B', 'C']);
		var head = series.head(2);
		expect(head.toValues()).to.eql(['A', 'B']);
	});

	it('can get tail of series', function () {

		var series = initSeries([0, 1, 2], ['A', 'B', 'C']);
		var head = series.tail(2);
		expect(head.toValues()).to.eql(['B', 'C']);
	});

	it('can skip while', function () {

		var series = initSeries([0, 1, 2, 3], [true, true, false, true]);
		var skipped = series.skipWhile(function (value) { return value; });
		expect(skipped.toPairs()).to.eql([
			[2, false],
			[3, true],
		]);
	});

	it('can skip until', function () {

		var series = initSeries([0, 1, 2, 3], [false, false, true, false]);
		var skipped = series.skipUntil(function (value) { return value; });
		expect(skipped.toPairs()).to.eql([
			[2, true],
			[3, false],
		]);
	});

	it('can take while', function () {

		var series = initSeries([0, 1, 2, 3], [true, true, false, true]);
		var skipped = series.takeWhile(function (value) { return value; });
		expect(skipped.toPairs()).to.eql([
			[0, true],
			[1, true],
		]);
	});

	it('can take until', function () {

		var series = initSeries([0, 1, 2, 3], [false, false, true, false]);		
		var skipped = series.takeUntil(function (value) { return value; });
		expect(skipped.toPairs()).to.eql([
			[0, false],
			[1, false],
		]);
	});

	it('can sum series', function () {

		var series = initSeries([0, 1, 2], [1, 2, 3]);		
		expect(series.sum()).to.eql(6);
	});

	it('can average series', function () {

		var series = initSeries([0, 1, 2], [1, 2, 3]);		
		expect(series.average()).to.eql(2);
	});

	it('can get series minimum', function () {

		var series = initSeries([0, 1, 2], [5, 2.5, 3]);		
		expect(series.min()).to.eql(2.5);
	});

	it('can get series maximum', function () {

		var series = initSeries([0, 1, 2], [5, 6, 3]);		
		expect(series.max()).to.eql(6);
	});

	it('can aggregate series with no seed', function () {

		var series = initSeries([0, 1, 2], [4, 8, 16]);

		var agg = series.aggregate(function (prevValue, value) {
				return prevValue + value;
			});

		expect(agg).to.eql(28);
	});

	it('can aggregate series with seed', function () {

		var series = initSeries([0, 1, 2], [4, 8, 16]);

		var agg = series.aggregate(2, function (prevValue, value) {
				return prevValue + value;
			});

		expect(agg).to.eql(30);
	});

	it('can aggregate series with a function as the seed', function () {

		var series = initSeries([0, 1, 2], [4, 8, 16]);

		var agg = series.aggregate(
			function () {
				return 2;
			},
			function (prevValue, value) {
				return function () {
					return prevValue() + value;
				};
			});

		expect(agg()).to.eql(30);
	});

	it('can convert to javascript object', function () {

		var series = initSeries([0, 1], [
			{
				Key: 'A',
				Value: 100,
			},
			{
				Key: 'B',
				Value: 200,
			},
		]);

		var obj = series.toObject(
			function (row) {
				return row.Key;
			},
			function (row) {
				return row.Value;
			}
		);
		expect(obj).to.eql({
			A: 100,
			B: 200,
		});
	});

	it('can convert to javascript object - with duplicate keys', function () {

		var series = initSeries([0, 1, 2], [
			{
				Key: 'A',
				Value: 100,
			},
			{
				Key: 'B',
				Value: 200,
			},
			{
				Key: 'A',
				Value: 3,
			},
		]);

		var obj = series.toObject(
			function (row) {
				return row.Key;
			},
			function (row) {
				return row.Value;
			}
		);
		expect(obj).to.eql({
			A: 3,
			B: 200,
		});
	});

	it('can zip two series', function () {

		var zipped = dataForge.range(0, 3)
			.zip(dataForge.range(10, 3), function (s1, s2) {
				return s1 + s2;
			});

		expect(zipped.toValues()).to.eql([0+10, 1+11, 2+12]);
	});

	it('can zip multiple series', function () {

		var zipped = dataForge.range(0, 3)
			.zip(
				dataForge.range(10, 3), 
				dataForge.range(100, 3),
				function (s1, s2, s3) {
					return s1 + s2 + s3;
				}
			);

		expect(zipped.toValues()).to.eql([0+10+100, 1+11+101, 2+12+102]);
	});

	it('for each', function () {

		var series = dataForge.range(0, 3)
			.select(function (v) {
				return v.toString(); 
			});

		var count = 0;
		series.forEach(function (v, i) {
			expect(i).to.eql(count);
			expect(v).to.eql(count.toString());
			++count;
		});

		expect(count).to.eql(3);
	});


});
