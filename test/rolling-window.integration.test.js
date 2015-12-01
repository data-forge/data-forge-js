'use strict';

describe('rolling window integration', function () {

	var dataForge = require('../index');

	var E = require('linq');
	var expect = require('chai').expect;

	it('blah', function () {

		var dataFrame = new dataForge.DataFrame(
			[
				"Value",
			],
			E.range(1, 12)
				.select(function (i) {
					return [i];
				})
				.toArray(),
			new dataForge.Index("__test__", E.range(10, 12).toArray())
		);

		var newColumn = dataFrame
			.getColumn('Value')
			.rollingWindow(5, function (index, values, rowIndex) {
				return [index[index.length-1], values[values.length-1]];
			});

		expect(newColumn.getIndex().getValues()).to.eql([14, 15, 16, 17, 18, 19, 20, 21]);
		expect(newColumn.getValues()).to.eql([5, 6, 7, 8, 9, 10, 11, 12]);

		var newDataFrame = dataFrame.setColumn('Value2', newColumn);

		expect(newDataFrame.getIndex().getValues()).to.eql([10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]);

		expect(newDataFrame.getValues()).to.eql([
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