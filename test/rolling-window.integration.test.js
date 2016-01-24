'use strict';

describe('rolling window integration', function () {

	var dataForge = require('../index');

	var E = require('linq');
	var expect = require('chai').expect;

	it('rolling window', function () {

		var dataFrame = new dataForge.DataFrame({
			columnNames: [ "Value" ],
			rows: E.range(1, 12)
				.select(function (i) {
					return [i];
				})
				.toArray(),
			index: new dataForge.Index(E.range(10, 12).toArray())
		});

		var newSeries = dataFrame.getSeries('Value')
			.rollingWindow(5, function (window, windowIndex) {
				//todo: var index = window.getIndex().last();
				//todo: var value = window.last();
				var index = window.getIndex().toValues();
				var values = window.toValues();
				return [index[index.length-1], values[values.length-1]];
			});

		expect(newSeries.getIndex().toValues()).to.eql([14, 15, 16, 17, 18, 19, 20, 21]);
		expect(newSeries.toValues()).to.eql([5, 6, 7, 8, 9, 10, 11, 12]);

		var newDataFrame = dataFrame.setSeries('Value2', newSeries);

		expect(newDataFrame.getIndex().toValues()).to.eql([10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]);

		expect(newDataFrame.toValues()).to.eql([
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

});