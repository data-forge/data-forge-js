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
			index: index,
		});
	};

	it('default index is generated', function () {
		
		var column = new dataForge.Series({ values: [100, 200] });
		expect(column.getIndex().take(2).toArray()).to.eql([			
			0,
			1			
		]);		
	});

	it('can get index', function () {
		
		var column = new dataForge.Series({ values: [100, 200], index: [5, 6] });
		expect(column.getIndex().toArray()).to.eql([
			5,
			6
		]);		
	});

	it('can set new index from array', function () {

		var series = new dataForge.Series({ values: [100, 200], index: [5, 6] });
		var modified = series.withIndex([10, 20]);
		expect(modified.getIndex().toArray()).to.eql([
			10,
			20
		]);		
		expect(modified.toArray()).to.eql([
			100,
			200
		]);		
	});

	it('can set new index from Series', function () {

		var series = new dataForge.Series({ values: [100, 200], index: [5, 6] });
		var modified = series.withIndex(new dataForge.Series({ values: [10, 20] }));
		expect(modified.getIndex().toArray()).to.eql([
			10,
			20
		]);		
		expect(modified.toArray()).to.eql([
			100,
			200
		]);		
	});
	
	it('can reset index', function () {

		var series = new dataForge.Series({ values: [100, 200], index: [5, 6] });
		var reset = series.resetIndex();
		expect(reset.getIndex().take(2).toArray()).to.eql([
			0,
			1
		]);
	});

	it('can get column values', function () {
		
		var column = new dataForge.Series({ values: [100, 200] });
		expect(column.toArray()).to.eql([			
			100,
			200			
		]);		
	});

	it('can specify values as an iterable', function () {
		
		var iterable = function () {
			return new ArrayIterator([100, 200]);
		};
		var column = new dataForge.Series({ values: iterable });
		expect(column.toArray()).to.eql([			
			100,
			200			
		]);		
	});

	it('can bake values from enumerator', function () {

		var series = initSeries([0, 1, 2, 3], [100, 300, 200, 5]);
		expect(series.toArray()).to.eql([100, 300, 200, 5]);
	});	

	it('can skip', function () {
		var series = initSeries([0, 1, 2, 3], [100, 300, 200, 5]);
		var skipped = series.skip(2);		
		expect(skipped.getIndex().toArray()).to.eql([2, 3]);
		expect(skipped.toArray()).to.eql([200, 5]);		
	});

	it('can take', function () {
		var series = initSeries([0, 1, 2, 3], [100, 300, 200, 5]);
		var skipped = series.take(2);		
		expect(skipped.getIndex().toArray()).to.eql([0, 1]);
		expect(skipped.toArray()).to.eql([100, 300]);		
	});

	it('can filter', function () {
		var series = initSeries([0, 1, 2, 3], [100, 300, 200, 5]);
		var filtered = series.where(function (value) {
				return value >= 100 && value < 300;
			});
		expect(filtered.getIndex().toArray()).to.eql([0, 2]);
		expect(filtered.toArray()).to.eql([100, 200]);		
	});

	it('can select', function () {
		var series = initSeries([0, 1, 2, 3], [100, 300, 200, 5]);
		var modified = series.select(function (value, index) {
				return value + 10;
			});
		expect(modified.getIndex().toArray()).to.eql([0, 1, 2, 3]);
		expect(modified.toArray()).to.eql([110, 310, 210, 15]);		
	});

	it('can select many - with array', function () {
		var series = initSeries([0, 1, 2, 3], [100, 300, 200, 5]);
		var modified = series.selectMany(function (value) {
				return E.range(0, 2)
					.select(function (i) {
						return value + i + 1;
					})
					.toArray();
			});
		expect(modified.getIndex().toArray()).to.eql([0, 0, 1, 1, 2, 2, 3, 3]);
		expect(modified.toArray()).to.eql([101, 102, 301, 302, 201, 202, 6, 7]);		
	});

	it('can select many - with series', function () {
		var series = initSeries([0, 1], [100, 300]);
		var modified = series.selectMany(function (value) {
				return dataForge.range(0, 2)
					.select(i => i + value);
			});
		expect(modified.getIndex().toArray()).to.eql([0, 0, 1, 1]);
		expect(modified.toArray()).to.eql([100, 101, 300, 301]);
	});

	it('can select many - with data-frame', function () {
		var series = initSeries([0, 1], [100, 300]);
		var modified = series.selectMany(function (value) {
				return dataForge.range(0, 2)
					.select(i => i + value)
					.inflate(v => { return { Value: v }; })
					;
			});
		expect(modified.getIndex().toArray()).to.eql([0, 0, 1, 1]);
		expect(modified.toArray()).to.eql([{ Value: 100 }, { Value: 101 }, { Value: 300 }, { Value: 301 }]);
	});

	it('responds gracefully to non-list returned from selectMany selector', function () {
		var series = initSeries([0], [100]);
		var modified = series.selectMany(function (value) {
				return 5.0; // non a list!
			});
		expect(function () {
				modified.toArray();
			})
			.to.throw();
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
		expect(sorted.getIndex().toArray()).to.eql([3, 2, 1, 0]);
		expect(sorted.toArray()).to.eql([
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
		expect(sorted.getIndex().toArray()).to.eql([0, 1, 2, 3]);
		expect(sorted.toArray()).to.eql([
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


	it('can get slice of rows - with integer indices', function () {

		var series = initSeries([0, 1, 2, 3], [100, 300, 200, 5]);
		var slice = series.between(1, 2);
		expect(slice.toPairs()).to.eql([
			[1, 300],
			[2, 200],
		]);
	});

	it('can get slice of rows - with string indices', function () {

		var series = new Series({
			index: ["a", "b", "c", "d", "e"], 
			values: [100, 300, 200, 5, 30],
		});
		var slice = series.between("b", "e");
		expect(slice.toPairs()).to.eql([
			["b", 300],
			["c", 200],
			["d", 5],
			["e", 30],
		]);
	});

	it('can get slice of rows from time series', function () {

		var series = initSeries([new Date(2016, 1, 1), new Date(2016, 1, 3), new Date(2016, 1, 5), new Date(2016, 1, 10)], [0, 1, 2, 3]);
		var slice = series.between(new Date(2016, 1, 2), new Date(2016, 1, 8));
		expect(slice.toPairs()).to.eql([
			[new Date(2016, 1, 3), 1],
			[new Date(2016, 1, 5), 2],
		]);
	});

	it('window produces Series', function () {

		var series = new Series({ values: [1, 2, 3, 4] });
		var windowed = series.window(2);

		expect(windowed).to.be.an.instanceof(Series);
		expect(windowed.count()).to.eql(2);

		var windowedPairs = windowed.toPairs();
		expect(windowedPairs.length).to.eql(2);
		expect(windowedPairs[0][0]).to.eql(0);
		expect(windowedPairs[0][1]).to.be.an.instanceof(Series);
		expect(windowedPairs[0][1].toPairs()).to.eql([
			[0, 1],
			[1, 2],
		]);
		expect(windowedPairs[1][0]).to.eql(1);
		expect(windowedPairs[1][1]).to.be.an.instanceof(Series);
		expect(windowedPairs[1][1].toPairs()).to.eql([
			[2, 3],
			[3, 4],
		]);
	});

	it('can compute window - creates an empty series from an empty data set', function () {

		var series = new Series();
		var windowed = series.window(2)
			.asPairs()
			.select(function (pair) {
				var windowIndex = pair[0];
				var window = pair[1];
				return [windowIndex, window.sum()];
			})
			.asValues()
			;

		expect(windowed.count()).to.eql(0);
	});

	it('can compute window - with even window size and even number of rows', function () {

		var series = new Series({ values: [1, 2, 3, 4] });
		var windowed = series
			.window(2)
			.asPairs()
			.select(function (pair) {
				var windowIndex = pair[0];
				var window = pair[1];
				return [windowIndex, window.toArray()];
			})
			.asValues()
			;

		expect(windowed.toPairs()).to.eql([
			[0, [1, 2]],
			[1, [3, 4]],
		]);
	});

	it('can compute window - with even window size and odd number of rows', function () {

		var series = new Series({ values: [1, 2, 3, 4, 5] });
		var windowed = series
			.window(2)
			.asPairs()
			.select(function (pair) {
				var windowIndex = pair[0];
				var window = pair[1];
				return [windowIndex, window.toArray()];
			})
			.asValues()
			;

		expect(windowed.toPairs()).to.eql([
			[0, [1, 2]],
			[1, [3, 4]],
			[2, [5]],
		]);
	});

	it('can compute window - with odd window size and odd number of rows', function () {

		var series = new Series({ values: [1, 2, 3, 4, 5, 6] });
		var windowed = series
			.window(3)
			.asPairs()
			.select(function (pair) {
				var windowIndex = pair[0];
				var window = pair[1];
				return [windowIndex, window.toArray()];
			})
			.asValues()
			;

		expect(windowed.toPairs()).to.eql([
			[0, [1, 2, 3]],
			[1, [4, 5, 6]],
		]);

	});

	it('can compute window - with odd window size and even number of rows', function () {

		var series = new Series({ values: [1, 2, 3, 4, 5] });
		var windowed = series
			.window(3)
			.asPairs()
			.select(function (pair) {
				var windowIndex = pair[0];
				var window = pair[1];
				return [windowIndex, window.toArray()];
			})
			.asValues()
			;

		expect(windowed.toPairs()).to.eql([
			[0, [1, 2, 3]],
			[1, [4, 5]],
		]);

	});

	it('can compute rolling window - from empty data set', function () {

		var series = initSeries([], []);
		var newSeries = series
			.rollingWindow(2)
			.asPairs()
			.select(function (pair) {
				var windowIndex = pair[0];
				var window = pair[1];
				return [windowIndex, window.toArray()];
			})
			.asValues()
			;

		expect(newSeries.toArray().length).to.eql(0);
	});

	it('rolling window returns 0 values when there are not enough values in the data set', function () {

		var series = initSeries([0, 1], [1, 2]);
		var newSeries = series
			.rollingWindow(3)
			.asPairs()
			.select(function (pair) {
				var windowIndex = pair[0];
				var window = pair[1];
				return [windowIndex, window.toArray()];
			})
			.asValues()
			;

		expect(newSeries.toArray().length).to.eql(0);
	});

	it('can compute rolling window - odd data set with even period', function () {

		var series = initSeries(E.range(0, 5).toArray(), E.range(0, 5).toArray());
		var newSeries = series
			.rollingWindow(2)
			.asPairs()
			.select(function (pair) {
				var windowIndex = pair[0];
				var window = pair[1];
				return [windowIndex, window.toArray()];
			})
			.asValues()
			;

		var index = newSeries.getIndex().toArray();
		expect(index).to.eql([0, 1, 2, 3]);

		var values = newSeries.toArray();
		expect(values.length).to.eql(4);
		expect(values[0]).to.eql([0, 1]);
		expect(values[1]).to.eql([1, 2]);
		expect(values[2]).to.eql([2, 3]);
		expect(values[3]).to.eql([3, 4]);
	});

	it('can compute rolling window - odd data set with odd period', function () {

		var series = initSeries(E.range(0, 5).toArray(), E.range(0, 5).toArray());
		var newSeries = series
			.rollingWindow(3)
			.asPairs()
			.select(function (pair) {
				var windowIndex = pair[0];
				var window = pair[1];
				return [windowIndex, window.toArray()];
			})
			.asValues()
			;

		var index = newSeries.getIndex().toArray();
		expect(index).to.eql([0, 1, 2]);

		var values = newSeries.toArray();
		expect(values.length).to.eql(3);
		expect(values[0]).to.eql([0, 1, 2]);
		expect(values[1]).to.eql([1, 2, 3]);
		expect(values[2]).to.eql([2, 3, 4]);
	});

	it('can compute rolling window - even data set with even period', function () {

		var series = initSeries(E.range(0, 6).toArray(), E.range(0, 6).toArray());
		var newSeries = series
			.rollingWindow(2)
			.asPairs()
			.select(function (pair) {
				var windowIndex = pair[0];
				var window = pair[1];
				return [windowIndex+10, window.toArray()];
			})
			.asValues()
			;

		var index = newSeries.getIndex().toArray();
		expect(index).to.eql([10, 11, 12, 13, 14]);

		var values = newSeries.toArray();
		expect(values.length).to.eql(5);
		expect(values[0]).to.eql([0, 1]);
		expect(values[1]).to.eql([1, 2]);
		expect(values[2]).to.eql([2, 3]);
		expect(values[3]).to.eql([3, 4]);
		expect(values[4]).to.eql([4, 5]);
	});

	it('can compute rolling window - even data set with odd period', function () {

		var series = initSeries(E.range(0, 6).toArray(), E.range(0, 6).toArray());
		var newSeries = series
			.rollingWindow(3)
			.asPairs()
			.select(function (pair) {
				var windowIndex = pair[0];
				var window = pair[1];
				return [windowIndex, window.toArray()];
			})
			.asValues()
			;

		var index = newSeries.getIndex().toArray();
		expect(index).to.eql([0, 1, 2, 3]);

		var values = newSeries.toArray();
		expect(values.length).to.eql(4);
		expect(values[0]).to.eql([0, 1, 2]);
		expect(values[1]).to.eql([1, 2, 3]);
		expect(values[2]).to.eql([2, 3, 4]);
		expect(values[3]).to.eql([3, 4, 5]);
	});

	it('can compute rolling window - can take last index and value from each window', function () {

		var series = initSeries(E.range(0, 6).toArray(), E.range(0, 6).toArray());
		var newSeries = series
			.rollingWindow(3)
			.asPairs()
			.select(function (pair) {
				var windowIndex = pair[0];
				var window = pair[1];
				var index = window.getIndex().toArray();
				var values = window.toArray();
				return [index[index.length-1], values[values.length-1]];
			})
			.asValues()
			;

		var index = newSeries.getIndex().toArray();
		expect(index).to.eql([2, 3, 4, 5]);

		var values = newSeries.toArray();
		expect(values).to.eql([2, 3, 4, 5]);
	});
	
	it('can compute pct changed', function () {

		var series = initSeries([0, 1, 2, 3], [1, 2, 4, 8]);
		var pctChanged = series.percentChange();
		expect(pctChanged.getIndex().toArray()).to.eql([1, 2, 3]);
		expect(pctChanged.toArray()).to.eql([1, 1, 1]);
	});

	it('can parse string series to int', function () {

		var series = initSeries([10, 5, 2], ['1', '100', '5']);
		var parsed = series.parseInts();

		expect(parsed.getIndex().toArray()).to.eql([10, 5, 2]);
		expect(parsed.toArray()).to.eql([1, 100, 5]);
	});

	it('can parse string series to int - with empty string', function () {

		var series = initSeries([10], ['']);
		var parsed = series.parseInts();

		expect(parsed.getIndex().toArray()).to.eql([10]);
		expect(parsed.toArray()).to.eql([]);
	});

	it('can parse string series to int - with undefined', function () {

		var series = initSeries([10], [undefined]);
		var parsed = series.parseInts();

		expect(parsed.getIndex().toArray()).to.eql([10]);
		expect(parsed.toArray()).to.eql([]);
	});

	it('can parse string series to int - throws when source value is not a string', function () {

		var series = initSeries([10], [5]);
		var parsed = series.parseInts();

		expect(function () { 
			parsed.toArray();
		}).to.throw();
	});

	it('can parse string series to float', function () {

		var series = initSeries([10, 5, 2], ['1', '100.2020', '5.5']);
		var parsed = series.parseFloats();

		expect(parsed.getIndex().toArray()).to.eql([10, 5, 2]);
		expect(parsed.toArray()).to.eql([1, 100.2020, 5.5]);
	});

	it('can parse string series to float - with empty string', function () {

		var series = initSeries([10], ['']);
		var parsed = series.parseFloats();

		expect(parsed.getIndex().toArray()).to.eql([10]);
		expect(parsed.toArray()).to.eql([]);
	});

	it('can parse string series to float - with undefined', function () {

		var series = initSeries([10], [undefined]);
		var parsed = series.parseFloats();

		expect(parsed.getIndex().toArray()).to.eql([10]);
		expect(parsed.toArray()).to.eql([]);
	});

	it('can parse string series to float - throws when source value is not a string', function () {

		var series = initSeries([10], [5]);
		var parsed = series.parseFloats();

		expect(function () { 
			parsed.toArray();
		}).to.throw();
	});

	it('can parse string series to date', function () {

		var series = initSeries([10, 5], ['1975-2-24', '2015-2-24']);
		var parsed = series.parseDates();

		expect(parsed.getIndex().toArray()).to.eql([10, 5]);
		expect(parsed.toArray()).to.eql([new Date(1975, 1, 24), new Date(2015, 1, 24)]); // Note months are 0-based here.
	});

	it('can parse string series to date - with empty string', function () {

		var series = initSeries([10], ['']);
		var parsed = series.parseDates();

		expect(parsed.getIndex().toArray()).to.eql([10]);
		expect(parsed.toArray()).to.eql([]);
	});

	it('can parse string series to date - with undefined', function () {

		var series = initSeries([10], [undefined]);
		var parsed = series.parseDates();

		expect(parsed.getIndex().toArray()).to.eql([10]);
		expect(parsed.toArray()).to.eql([]);
	});

	it('can parse string series to date - throws when source value is not a string', function () {

		var series = initSeries([10], [5]);
		var parsed = series.parseDates();

		expect(function () { 
			parsed.toArray();
		}).to.throw();
	});

	it('can parse string series to date - with format string', function () {

		var series = initSeries([10, 5], ['24-02-75', '24-02-15']);
		var parsed = series.parseDates('DD-MM-YY');

		expect(parsed.getIndex().toArray()).to.eql([10, 5]);
		expect(parsed.toArray()).to.eql([new Date(1975, 1, 24), new Date(2015, 1, 24)]); // Note months are 0-based here.
	});

	it('can parse values to strings', function () {

		var series = initSeries([1, 2, 3, 4, 5, 6], [1, null, undefined, "foo", 5.5, new Date(2015, 1, 1)]);
		var converted = series.toStrings();

		expect(converted.getIndex().toArray()).to.eql([1, 2, 3, 4, 5, 6]);
		expect(converted.toArray()).to.eql([
			'1', 
			null, 
			"foo", 
			'5.5', 
			'Sun Feb 01 2015 00:00:00 GMT+1000 (E. Australia Standard Time)'
		]);

	});

	it('can specify format string for date series', function () {

		var series = initSeries([1], [new Date(2015, 1, 3)]);
		var converted = series.toStrings('YYYY-DD-MM');

		expect(converted.getIndex().toArray()).to.eql([1]);
		expect(converted.toArray()).to.eql([
			'2015-03-02',
		]);
	});

	it('can specify format string for date series - with moment', function () {

		var series = initSeries([1], [moment(new Date(2015, 1, 3))]);
		var converted = series.toStrings('YYYY-DD-MM');

		expect(converted.getIndex().toArray()).to.eql([1]);
		expect(converted.toArray()).to.eql([
			'2015-03-02',
		]);
	});

	it('can detect actual series type', function () {

		var series = initSeries([1], [1]);
		var types = series.detectTypes();
		expect(types.getColumnNames()).to.eql(['Type', 'Frequency']);
		expect(types.getIndex().take(1).toArray()).to.eql([0]);
		expect(types.toRows()).to.eql([
			['number', 100]
		]);
	});

	it('can detect date series type', function () {

		var series = initSeries([1], [new Date(2015, 1, 1)]);
		var types = series.detectTypes();
		expect(types.getColumnNames()).to.eql(['Type', 'Frequency']);
		expect(types.getIndex().take(1).toArray()).to.eql([0]);
		expect(types.toRows()).to.eql([
			['date', 100]
		]);
	});

	it('can detect multiple series types', function () {

		var series = initSeries([1, 2], [1, 'foo']);
		var types = series.detectTypes();
		expect(types.getColumnNames()).to.eql(['Type', 'Frequency']);
		expect(types.getIndex().take(2).toArray()).to.eql([0, 1]);
		expect(types.toRows()).to.eql([
			['number', 50],
			['string', 50],
		]);
	});

	it('can detect values', function () {
		var series = initSeries([1, 2], [1, 'foo']);
		var values = series.detectValues();
		expect(values.getColumnNames()).to.eql(['Value', 'Frequency']);
		expect(values.getIndex().take(2).toArray()).to.eql([0, 1]);
		expect(values.toRows()).to.eql([
			[1, 50],
			['foo', 50],
		]);
	});

	it('can truncate string values', function () {

		var series = initSeries([1, 2], ['foo', 'bar']);
		var truncated = series.truncateStrings(2);

		expect(truncated.getIndex().toArray()).to.eql([1, 2]);
		expect(truncated.toArray()).to.eql(['fo', 'ba']);
	});

	it('truncation ignores strings that are already short enough', function () {

		var series = initSeries([1, 2], ['foo', 'bar']);
		var truncated = series.truncateStrings(20);

		expect(truncated.toArray()).to.eql(['foo', 'bar']);
	});

	it('truncation passes through other values', function () {

		var series = initSeries([1, 2, 3, 4], [null, undefined, 1, new Date(2015, 1, 1)]);
		var truncated = series.truncateStrings(20);

		expect(truncated.toArray()).to.eql([null, 1, new Date(2015, 1, 1)]);
	});

	it('can bake series', function () {

		var indicies = [1, 2];
		var values = ['foo', 'bar'];
		var series = initSeries(indicies, values);
		var baked = series.bake();

		expect(baked).not.to.equal(series);
		expect(baked).to.be.an.instanceOf(dataForge.Series);
		expect(baked.getIndex()).to.be.an.instanceOf(dataForge.Series);
		expect(baked.getIndex().toArray()).to.eql(indicies);
		expect(baked.toArray()).to.eql(values);
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

	it('getting first value of empty series throws exception', function () {

		var series = initSeries([], []);

		expect(function () {
			series.first();
		}).to.throw();
	});

	it('getting last value of empty series throws exception', function () {

		var series = initSeries([], []);

		expect(function () {
			series.last();
		}).to.throw();
	});

	it('can get first and last values', function () {

		var series = initSeries([0, 1, 2], ['A', 'B', 'C']);

		expect(series.first()).to.eql('A');
		expect(series.last()).to.eql('C');
	});

	it('getting first pair of empty series throws exception', function () {

		var series = initSeries([], []);

		expect(function () {
			series.firstPair();
		}).to.throw();
	});

	it('can reverse', function () {

		var series = initSeries([0, 1, 2], ['A', 'B', 'C']);
		var reversed = series.reverse();
		expect(series.toArray()).to.eql(['A', 'B', 'C']);
		expect(series.getIndex().toArray()).to.eql([0, 1, 2]);
		expect(reversed.toArray()).to.eql(['C', 'B', 'A']);
		expect(reversed.getIndex().toArray()).to.eql([2, 1, 0]);
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
		expect(dataFrame.toRows()).to.eql([
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
		expect(dataFrame.toRows()).to.eql([
			[1, 2],
			[3, 4],
		]);

	});

	it('can get head of series', function () {

		var series = initSeries([0, 1, 2], ['A', 'B', 'C']);
		var head = series.head(2);
		expect(head.toArray()).to.eql(['A', 'B']);
	});

	it('can get tail of series', function () {

		var series = initSeries([0, 1, 2], ['A', 'B', 'C']);
		var head = series.tail(2);
		expect(head.toArray()).to.eql(['B', 'C']);
	});

	it('can skip while', function () {

		var series = initSeries([0, 1, 2, 3], [true, true, false, true]);
		var skipped = series.skipWhile(function (value) { 
			return value; 
		});
		expect(skipped.toPairs()).to.eql([
			[2, false],
			[3, true],
		]);
	});

	it('can skip until', function () {

		var series = initSeries([0, 1, 2, 3], [false, false, true, false]);
		var skipped = series.skipUntil(function (value) { 
			return value; 
		});
		expect(skipped.toPairs()).to.eql([
			[2, true],
			[3, false],
		]);
	});

	it('can take while', function () {

		var series = initSeries([0, 1, 2, 3], [true, true, false, true]);
		var skipped = series.takeWhile(function (value) { 
			return value; 
		});
		expect(skipped.toPairs()).to.eql([
			[0, true],
			[1, true],
		]);
	});

	it('can take until', function () {

		var series = initSeries([0, 1, 2, 3], [false, false, true, false]);		
		var skipped = series.takeUntil(function (value) { 
			return value; 
		});
		expect(skipped.toPairs()).to.eql([
			[0, false],
			[1, false],
		]);
	});

	it('sum of empty series is zero', function () {

		var series = new Series();
		expect(series.sum()).to.eql(0);
	});

	it('can sum series', function () {

		var series = initSeries([0, 1, 2], [1, 2, 3]);		
		expect(series.sum()).to.eql(6);
	});

	it('can average series', function () {

		var series = initSeries([0, 1, 2], [1, 2, 3]);		
		expect(series.average()).to.eql(2);
	});

	it('average of an empty series is zero', function () {

		var series = initSeries([], []);
		expect(series.average()).to.eql(0);
	});

	it('can get median of even series', function () {

		var series = initSeries([0, 1, 2, 3], [1, 2, 3, 4]);		
		expect(series.median()).to.eql(2.5);
	});

	it('can get median of odd series', function () {

		var series = initSeries([0, 1, 2], [1, 2, 3]);		
		expect(series.median()).to.eql(2);
	});

	it('median of an empty series is zero', function () {

		var series = initSeries([], []);
		expect(series.median()).to.eql(0);
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



	it('for each', function () {

		var series = dataForge.range(0, 3)
			.select(function (v) {
				return v.toString(); 
			});

		var count = 0;
		series.forEach(function (v) {
			expect(v).to.eql(count.toString());
			++count;
		});

		expect(count).to.eql(3);
	});

	it('all - zero elements', function () {

		var series = new Series({ values: [] });

		expect(series.all(function (value) { 
				return value === 200; 
			})).to.eql(false);
	});

	it('all - no elements match', function () {

		var series = new Series({ values: [1, 2, 3, 4] });

		expect(series.all(function (value) { 
				return value === 200; 
			})).to.eql(false);
	});

	it('all - some elements match', function () {

		var series = new Series({ values: [1, 3, 3, 4] });

		expect(series.all(function (value) { 
				return value === 3; 
			})).to.eql(false);
	});

	it('all - all elements match', function () {

		var series = new Series({ values: [5, 5, 5, 5] });

		expect(series.all(function (value) { 
				return value === 5; 
			})).to.eql(true);
	});

	it('any - zero elements', function () {

		var series = new Series({ values: [] });

		expect(series.any(function (value) { 
				return value === 200; 
			})).to.eql(false);
	});

	it('any - no elements match', function () {

		var series = new Series({ values: [1, 2, 3, 4] });

		expect(series.any(function (value) { 
				return value === 200; 
			})).to.eql(false);
	});

	it('any - some elements match', function () {

		var series = new Series({ values: [1, 3, 3, 4] });

		expect(series.any(function (value) { 
				return value === 3; 
			})).to.eql(true);
	});

	it('any - all elements match', function () {

		var series = new Series({ values: [5, 5, 5, 5] });

		expect(series.any(function (value) { 
				return value === 5; 
			})).to.eql(true);
	});	

	it('any - with no predicate - no elements', function () {

		var series = new Series({ values: [] });

		expect(series.any()).to.eql(false);
	});

	it('any - with no predicate - elements exist', function () {

		var series = new Series({ values: [5, 5, 5, 5] });

		expect(series.any()).to.eql(true);
	});	

	it('none - zero elements', function () {

		var series = new Series({ values: [] });

		expect(series.none(function (value) { 
				return value === 200; 
			})).to.eql(true);
	});

	it('none - no elements match', function () {

		var series = new Series({ values: [1, 2, 3, 4] });

		expect(series.none(function (value) { 
				return value === 200; 
			})).to.eql(true);
	});

	it('none - some elements match', function () {

		var series = new Series({ values: [1, 3, 3, 4] });

		expect(series.none(function (value) { 
				return value === 3; 
			})).to.eql(false);
	});

	it('none - all elements match', function () {

		var series = new Series({ values: [5, 5, 5, 5] });

		expect(series.none(function (value) { 
				return value === 5; 
			})).to.eql(false);
	});	

	it('none - with no predicate - zero elements', function () {

		var series = new Series({ values: [] });

		expect(series.none()).to.eql(true);
	});

	it('none - with no predicate - has existing elements', function () {

		var series = new Series({ values: [5, 5, 5, 5] });

		expect(series.none()).to.eql(false);
	});	

	it('can collapse sequential duplicates and take first index', function () {

		var series = new Series({ 
			index:  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
			values: [1, 1, 2, 3, 3, 3, 5, 6, 6, 7],
		});

		var collapsed = series.sequentialDistinct();

		expect(collapsed.toPairs()).to.eql([
			[0, 1],
			[2, 2],
			[3, 3],
			[6, 5],
			[7, 6],
			[9, 7],
		]);
	});

	it('can collapse sequential duplicates with custom selector', function () {

		var series = new Series({ 
			index:  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
			values: [{ A: 1 }, { A: 1 }, { A: 2 }, { A: 3 }, { A: 3 }, { A: 3 }, { A: 5 }, { A: 6 }, { A: 6 }, { A: 7 }],
		});

		var collapsed = series
			.sequentialDistinct(value => value.A)
			.select(value => value.A)
			;

		expect(collapsed.toPairs()).to.eql([
			[0, 1],
			[2, 2],
			[3, 3],
			[6, 5],
			[7, 6],
			[9, 7],
		]);
	});

	it('can group sequential duplicates and take first index', function () {

		var series = new Series({ 
			index:  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
			values: [1, 1, 2, 3, 3, 3, 5, 6, 6, 7],
		});

		var collapsed = series.groupSequentialBy()
			.asPairs()
			.select(function (pair) {
				var windowIndex = pair[0];
				var window = pair[1];
				return [window.getIndex().first(), window.first()];
			})
			.asValues()
			;

		expect(collapsed.toPairs()).to.eql([
			[0, 1],
			[2, 2],
			[3, 3],
			[6, 5],
			[7, 6],
			[9, 7],
		]);
	});

	it('can group sequential duplicates and take last index', function () {

		var series = new Series({ 
			index:  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
			values: [1, 1, 2, 3, 3, 3, 5, 6, 6, 7],
		});

		var collapsed = series.groupSequentialBy()
			.asPairs()
			.select(function (pair) {
				var windowIndex = pair[0];
				var window = pair[1];
				return [window.getIndex().last(), window.last()];
			})
			.asValues()
			;

		expect(collapsed.toPairs()).to.eql([
			[1, 1],
			[2, 2],
			[5, 3],
			[6, 5],
			[8, 6],
			[9, 7],
		]);
	});

	it('can group sequential with custom selector', function () {

		var series = new Series({ 
			index:  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
			values: [{ A: 1 }, { A: 1 }, { A: 2 }, { A: 3 }, { A: 3 }, { A: 3 }, { A: 5 }, { A: 6 }, { A: 6 }, { A: 7 }],
		});

		var collapsed = series.groupSequentialBy(value => value.A)
			.asPairs()
			.select(function (pair) {
				var windowIndex = pair[0];
				var window = pair[1];
				return [window.getIndex().last(), window.last().A];
			})
			.asValues()
			;

		expect(collapsed.toPairs()).to.eql([
			[1, 1],
			[2, 2],
			[5, 3],
			[6, 5],
			[8, 6],
			[9, 7],
		]);
	});

	it('can distinct items', function () {

		var series = new Series({ 
			index:  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
			values: [1, 1, 2, 1, 1, 2, 3, 4, 3, 3],
		});

		var collapsed = series.distinct();

		expect(collapsed.toPairs()).to.eql([
			[0, 1],
			[2, 2],
			[6, 3],
			[7, 4],
		]);
	});

	it('can distinct items with custom selector', function () {

		var series = new Series({ 
			index:  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
			values: [{ A: 1 }, { A: 1 }, { A: 2 }, { A: 1 }, { A: 1 }, { A: 2 }, { A: 3 }, { A: 4 }, { A: 3 }, { A: 3 }],
		});

		var collapsed = series
			.distinct(value => value.A)
			.select(value => value.A)
			;

		expect(collapsed.toPairs()).to.eql([
			[0, 1],
			[2, 2],
			[6, 3],
			[7, 4],
		]);
	});

	it('variable window', function () {

		var series = new Series({ 
			index:  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
			values: [1, 1, 2, 1, 1, 2, 3, 4, 3, 3],
		});

		var aggregated = series
			.variableWindow(function (a, b) {
				return a === b;
			})
			.asPairs()
			.select(function (pair) {
				var windowIndex = pair[0];
				var window = pair[1];
				return [window.getIndex().first(), window.count()];
			})
			.asValues()
			;

		expect(aggregated.toPairs()).to.eql([
			[0, 2],
			[2, 1],
			[3, 2],
			[5, 1],
			[6, 1],
			[7, 1],
			[8, 2]
		]);
	});

	it('can insert pair at start of empty series', function () {

		var series = new Series();
		var modified = series.insertPair([10, 100]);
		expect(modified.toPairs()).to.eql([
			[10, 100]
		]);
	});

	it('can insert pair at start of series with existing items', function () {

		var series = new Series({
			index:  [1,  2],
			values: [10, 11],
		});
		var modified = series.insertPair([20, 100]);
		expect(modified.toPairs()).to.eql([
			[20, 100],
			[1, 10],
			[2, 11],
		]);
	});


	it('can append pair to empty series', function () {

		var series = new Series();
		var appended = series.appendPair([10, 100]);
		expect(appended.toPairs()).to.eql([
			[10, 100]
		]);
	});

	it('can append pair to series with existing items', function () {

		var series = new Series({
			index:  [1,  2],
			values: [10, 11],
		});
		var appended = series.appendPair([20, 100]);
		expect(appended.toPairs()).to.eql([
			[1, 10],
			[2, 11],
			[20, 100],
		]);
	});


	it('can fill gaps in series - fill forward', function () {

		var seriesWithGaps = new Series({
			index:  [1,  2,  6,  7,  10, 11],
			values: [10, 11, 12, 13, 14, 15],
		});

		var seriesWithoutGaps = seriesWithGaps.fillGaps(
			function (pairA, pairB) {
				return pairB[0] - pairA[0] > 1;
			},
			function (pairA, pairB) {
				var gapSize = pairB[0] - pairA[0];
				var numEntries = gapSize - 1;
				return E.range(0, numEntries)
					.select(i => [
						pairA[0] + i + 1,
						pairA[1], 
					])
					.toArray();
			}
		);

		expect(seriesWithoutGaps.toPairs()).to.eql([
			[1, 10],
			[2, 11],
			[3, 11],
			[4, 11],
			[5, 11],
			[6, 12],
			[7, 13],
			[8, 13],
			[9, 13],
			[10, 14],
			[11, 15],
		]);
	});

	it('can group by value', function () {

		var series = new Series({
			index:  [0, 1, 2, 3, 4, 5, 6],
			values: [1, 2, 2, 3, 2, 3, 5],
		});

		var grouped = series.groupBy(function (value, index) {
				return value; 
			});

		expect(grouped.count()).to.eql(4);

		var group1 = grouped.skip(0).first();
		expect(group1.toPairs()).to.eql([
			[0, 1],
		]);

		var group2 = grouped.skip(1).first();
		expect(group2.toPairs()).to.eql([
			[1, 2],
			[2, 2],
			[4, 2],
		]);

		var group3 = grouped.skip(2).first();
		expect(group3.toPairs()).to.eql([
			[3, 3],
			[5, 3],
		]);

		var group4 = grouped.skip(3).first();
		expect(group4.toPairs()).to.eql([
			[6, 5],
		]);
	});

	it('can get value by index', function () {

		var series = new Series({ 
			index:  [100, 200, 300],
			values: [10, 20, 30],
		});

		expect(series.at(200)).to.eql(20);
	});

	it('getting by index returns undefined when the requested index does not exist', function () {

		var series = new Series({ 
			index:  [100, 300],
			values: [10, 30],
		});

		expect(series.at(200)).to.eql(undefined);
	});

	it('getting by index returns undefined when the series is empty', function () {

		var series = new Series();
		expect(series.at(200)).to.eql(undefined);
	});

	it('can select default instead of empty series - array', function () {

		var series = new Series();
		var defaulted = series.defaultIfEmpty([1, 2]);
		expect(defaulted.toArray()).to.eql([1, 2]);
	});

	it('can select default instead of empty series - series', function () {

		var series = new Series();
		var defaulted = series.defaultIfEmpty(new Series({ values: [1, 2] }));
		expect(defaulted.toArray()).to.eql([1, 2]);
	});

	it('default is ignored for non-empty series', function () {

		var series = new Series({ values: [5, 6] });
		var defaulted = series.defaultIfEmpty([1, 2]);
		expect(defaulted.toArray()).to.eql([5, 6]);
	});

	it('can get union of 2 series with unique values', function () {

		var series1 = new Series({ values: [5, 6] })
		var series2 = new Series({ values: [7, 8] })
		var result = series1.union(series2);

		expect(result.toArray()).to.eql([5, 6, 7, 8]);
	});

	it('can get union of 2 series with overlapping values', function () {

		var series1 = new Series({ values: [5, 6] })
		var series2 = new Series({ values: [6, 7] })
		var result = series1.union(series2);

		expect(result.toArray()).to.eql([5, 6, 7]);
	});

	it('union can work with selector', function () {

		var series1 = new Series({ values: [{ X: 5 }, { X: 6 }] })
		var series2 = new Series({ values: [{ X: 6 }, { X: 7 }] })
		var result = series1.union(series2, function (row) { 
			return row.X;
		});

		expect(result.toArray()).to.eql([ { X: 5 }, { X: 6 }, { X: 7 }]);
	});

	it('can get intersection of 2 series with overlapping values', function () {
		
		var series1 = new Series({ values: [5, 6] })
		var series2 = new Series({ values: [6, 7] })
		var result = series1.intersection(series2);

		expect(result.toArray()).to.eql([6]);
	});

	it('intersection result is empty for 2 series that have no overlapping values', function () {

		var series1 = new Series({ values: [5, 6] })
		var series2 = new Series({ values: [7, 8] })
		var result = series1.intersection(series2);

		expect(result.toArray()).to.eql([]);
	});

	it('intersection can work with selector', function () {

		var series1 = new Series({ values: [{ X: 5 }, { X: 6 }] })
		var series2 = new Series({ values: [{ X: 6 }, { X: 7 }] })
		var result = series1.intersection(series2, function (left, right) { 
			return left.X === right.X;
		});

		expect(result.toArray()).to.eql([ { X: 6 }, ]);
	});

	it('can get exception of 2 series with overlapping values', function () {
		
		var series1 = new Series({ values: [5, 6] })
		var series2 = new Series({ values: [6, 7] })
		var result = series1.except(series2);

		expect(result.toArray()).to.eql([5]);
	});

	it('exception result is empty for 2 series that have fully overlapping values', function () {

		var series1 = new Series({ values: [5, 6] })
		var series2 = new Series({ values: [5, 6] })
		var result = series1.except(series2);

		expect(result.toArray()).to.eql([]);
	});

	it('except can work with selector', function () {

		var series1 = new Series({ values: [{ X: 5 }, { X: 6 }] })
		var series2 = new Series({ values: [{ X: 6 }, { X: 7 }] })
		var result = series1.except(series2, function (left, right) { 
			return left.X === right.X;
		});

		expect(result.toArray()).to.eql([ { X: 5 }, ]);
	});

	it('can transform a series to a series of pairs', function () {

		var series = new Series({
			index: [10, 20, 30],
			values: [1, 2, 3],
		});

		var pairs = series.asPairs().toArray();
		expect(pairs).to.eql([
			[10, 1],
			[20, 2],
			[30, 3],
		]);


	});

	it('can transform series of pairs to series of values', function () {

		var series = new Series({
			index: [10, 20, 30],
			values: [1, 2, 3],
		});

		var values = series.asPairs().asValues();
		expect(values.toPairs()).to.eql([
			[10, 1],
			[20, 2],
			[30, 3],
		]);
	});

	it('can get series starting at particular index - with integer index', function () {

		var series = new Series({
			index: [10, 20, 30],
			values: [1, 2, 3],
		});
		
		var reduced = series.startAt(20);
		expect(reduced.toPairs()).to.eql([
			[20, 2],
			[30, 3],
		]); 	
	});

	it('can get series starting before a particular index - with integer index', function () {

		var series = new Series({
			index: [10, 20, 30],
			values: [1, 2, 3],
		});
		
		var reduced = series.startAt(15);
		expect(reduced.toPairs()).to.eql([
			[20, 2],
			[30, 3],
		]); 	
	});

	it('can get series starting at particular index - with date index', function () {

		var series = new Series({
			index: [
				new Date(2016, 5, 1), 
				new Date(2016, 5, 5), 
				new Date(2016, 5, 10),
			],
			values: [1, 2, 3],
		});
		
		var reduced = series.startAt(new Date(2016, 5, 5));
		expect(reduced.toPairs()).to.eql([
			[new Date(2016, 5, 5), 2],
			[new Date(2016, 5, 10), 3],
		]); 	
	});

	it('can get series starting before a particular index - with date index', function () {

		var series = new Series({
			index: [
				new Date(2016, 5, 1), 
				new Date(2016, 5, 5), 
				new Date(2016, 5, 10),
			],
			values: [1, 2, 3],
		});
		
		var reduced = series.startAt(new Date(2016, 5, 4));
		expect(reduced.toPairs()).to.eql([
			[new Date(2016, 5, 5), 2],
			[new Date(2016, 5, 10), 3],
		]); 	
	});

	it('can get series ending at particular index - with integer index', function () {

		var series = new Series({
			index: [10, 20, 30],
			values: [1, 2, 3],
		});
		
		var reduced = series.endAt(20);
		expect(reduced.toPairs()).to.eql([
			[10, 1],
			[20, 2],
		]); 	
	});

	it('can get series ending before a particular index - with integer index', function () {

		var series = new Series({
			index: [10, 20, 30],
			values: [1, 2, 3],
		});
		
		var reduced = series.endAt(25);
		expect(reduced.toPairs()).to.eql([
			[10, 1],
			[20, 2],
		]); 	
	});

	it('can get series ending at particular index - with date index', function () {

		var series = new Series({
			index: [
				new Date(2016, 5, 1), 
				new Date(2016, 5, 5), 
				new Date(2016, 5, 10),
			],
			values: [1, 2, 3],
		});
		
		var reduced = series.endAt(new Date(2016, 5, 5));
		expect(reduced.toPairs()).to.eql([
			[new Date(2016, 5, 1), 1],
			[new Date(2016, 5, 5), 2],
		]); 	
	});

	it('can get series ending before a particular index - with date index', function () {

		var series = new Series({
			index: [
				new Date(2016, 5, 1), 
				new Date(2016, 5, 5), 
				new Date(2016, 5, 10),
			],
			values: [1, 2, 3],
		});
		
		var reduced = series.endAt(new Date(2016, 5, 6));
		expect(reduced.toPairs()).to.eql([
			[new Date(2016, 5, 1), 1],
			[new Date(2016, 5, 5), 2],
		]); 	
	});

	it('can get series before a particular index - with integer index', function () {

		var series = new Series({
			index: [10, 20, 30],
			values: [1, 2, 3],
		});
		
		var reduced = series.before(25);
		expect(reduced.toPairs()).to.eql([
			[10, 1],
			[20, 2],
		]); 	
	});

	it('can get series before a particular index - with date index', function () {

		var series = new Series({
			index: [
				new Date(2016, 5, 1), 
				new Date(2016, 5, 5), 
				new Date(2016, 5, 10),
			],
			values: [1, 2, 3],
		});
		
		var reduced = series.before(new Date(2016, 5, 6));
		expect(reduced.toPairs()).to.eql([
			[new Date(2016, 5, 1), 1],
			[new Date(2016, 5, 5), 2],
		]); 	
	});

	it('can get series after a particular index - with integer index', function () {

		var series = new Series({
			index: [10, 20, 30],
			values: [1, 2, 3],
		});
		
		var reduced = series.after(15);
		expect(reduced.toPairs()).to.eql([
			[20, 2],
			[30, 3],
		]); 	
	});

	it('can get series after a particular index - with date index', function () {

		var series = new Series({
			index: [
				new Date(2016, 5, 1), 
				new Date(2016, 5, 5), 
				new Date(2016, 5, 10),
			],
			values: [1, 2, 3],
		});
		
		var reduced = series.after(new Date(2016, 5, 2));
		expect(reduced.toPairs()).to.eql([
			[new Date(2016, 5, 5), 2],
			[new Date(2016, 5, 10), 3],
		]); 	
	});

	it('can get series between particular indices - with integer index', function () {

		var series = new Series({
			index: [10, 20, 30],
			values: [1, 2, 3],
		});
		
		var reduced = series.between(11, 25);
		expect(reduced.toPairs()).to.eql([
			[20, 2],
		]); 	
	});

	it('can get series between particular indices - with date index', function () {

		var series = new Series({
			index: [
				new Date(2016, 5, 1), 
				new Date(2016, 5, 5), 
				new Date(2016, 5, 10),
			],
			values: [1, 2, 3],
		});
		
		var reduced = series.between(new Date(2016, 5, 2), new Date(2016, 5, 8));
		expect(reduced.toPairs()).to.eql([
			[new Date(2016, 5, 5), 2],
		]); 	
	});
});

