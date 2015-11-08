'use strict';

describe('rolling window integration', function () {

	var panjas = require('../index');

	var E = require('linq');
	var expect = require('chai').expect;

	it('blah', function () {

		var dataFrame = new panjas.DataFrame(
			[
				"Value",
			],
			E.range(1, 12)
				.select(function (i) {
					return [i];
				})
				.toArray()
		);

		var newValues = dataFrame
			.getColumn('Value')
			.rollingWindow(5, function (window) {
				return window[window.length-1];
			})
			.getValues();

		expect(newValues).to.eql([5, 6, 7, 8, 9, 10, 11, 12]);

		var newDataFrame = dataFrame.setColumn('Value2', newValues);

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