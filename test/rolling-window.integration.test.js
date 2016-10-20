'use strict';

describe('rolling window integration', function () {

	var dataForge = require('../index');

	var E = require('linq');
	var expect = require('chai').expect;
	var assert = require('chai').assert;

	it('rolling window', function () {

		var dataFrame = new dataForge.DataFrame({
			columnNames: [ "Value" ],
			values: E.range(1, 12)
				.select(function (i) {
					return [i];
				})
				.toArray(),
			index: E.range(10, 12).toArray()
		});

		var newSeries = dataFrame.getSeries('Value')
			.rollingWindow(5)
			.asPairs()
			.select(function (pair) {
				var windowIndex = pair[0]
				var window = pair[1];
				return [window.getIndex().last(), window.last()];
			})
			.asValues()
			;

		expect(newSeries.getIndex().toArray()).to.eql([14, 15, 16, 17, 18, 19, 20, 21]);
		expect(newSeries.toArray()).to.eql([5, 6, 7, 8, 9, 10, 11, 12]);

		var newDataFrame = dataFrame.withSeries('Value2', newSeries);

		expect(newDataFrame.getIndex().toArray()).to.eql([10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]);

		expect(newDataFrame.toRows()).to.eql([
			[1, undefined],
			[2, undefined],
			[3, undefined],
			[4, undefined],
			[5, 5],
			[6, 6],
			[7, 7],
			[8, 8],
			[9, 9],
			[10, 10],
			[11, 11],
			[12, 12],
		]);

	});

	var initDataFrame = function (columns, values, index) {
		assert.isArray(columns);
		assert.isArray(values);
		
		var config = {
			columnNames: columns,
			values: values,			
		};

		if (index) {
			config.index = index;
		}

		return new dataForge.DataFrame(config);
	};

	//
	// Generate a data frame for testing.
	//
	var genDataFrame = function (numColumns, numRows) {

		var columnNames = E.range(0, numColumns)
			.select(function (columnIndex) {
				return (columnIndex+1).toString();
			})
			.toArray();
		var rows = E.range(0, numRows)
			.select(function (rowIndex) {
				return E.range(0, numColumns)
					.select(function (columnIndex) {
						return (rowIndex+1) * (columnIndex+1);
					})
					.toArray();
			})
			.toArray();
		var index = E.range(0, numRows)
			.toArray();

		return initDataFrame(columnNames, rows, index);

	};

	it('can use window and selectMany to generate multiple elements', function () {

		var dataFrame = genDataFrame(2, 4);
		var series = dataFrame
			.window(2)
			.asPairs()
			.select(function (pair) {
				var windowIndex = pair[0]
				var window = pair[1];
				return [windowIndex, [window.getSeries("1").sum(), window.getSeries("2").sum()]];
			})
			.asValues()
			.selectMany(function (value) {
				assert.isArray(value);
				return value; // The value is already a list.
			});

		expect(series.toPairs()).to.eql([
			[0, 3],
			[0, 6],
			[1, 7],
			[1, 14],
		]);
	});

	it('can use rollingWindow and selectMany to generate multiple elements', function () {

		var dataFrame = genDataFrame(2, 4);
		var series = dataFrame
			.rollingWindow(2)
			.asPairs()
			.select(function (pair) {
				var windowIndex = pair[0]
				var window = pair[1];
				return [
					windowIndex, 
					[
						window.getSeries("1").sum(), 
						window.getSeries("2").sum()
					]
				];
			})
			.asValues()
			.selectMany(function (value) {
				assert.isArray(value);
				return value; // The value is already a list.
			});

		expect(series.toPairs()).to.eql([
			[0, 3],
			[0, 6],
			[1, 5],
			[1, 10],
			[2, 7],
			[2, 14],
		]);
	});

});