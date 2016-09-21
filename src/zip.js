'use strict';

var assert = require('chai').assert;
var E = require('linq');
var Series = require('./series.js');

/*
 * Zip together multiple series or data-frames to create a new series or data-frame.
 * Preserves the index of the first series or dataframe.
 *
 * @param {array} input - Array of series to zip together.
 * @param {function} selector - Selector function that produces a new series based on the input series.
 */
module.exports = function (input, selector, Constructor) {

	assert.isArray(input, "Expected 'input' parameter to zipSeries/DataFrames to be an array of Series or DataFrames.");
	assert.isFunction(selector, "Expected 'selector' parameter to zipSeries/DataFrames to be a function.");
	assert.isFunction(Constructor, "Expected 'Constructor' parameter to zipSeries/DataFrames to be a constructor function.");

	var toZip = E.from(input)
		.select(function (sequence) {
			return sequence.toValues();
		})
		.toArray();

	var length = E.from(toZip)
		.select(function (values) { 
			return values.length; 
		})
		.min();

	var output = [];

	for (var i = 0; i < length; ++i) {
		var curElements = E.from(toZip)
			.select(function (values) {
				return values[i];
			})
			.toArray();
		output.push(selector(new Series({ values: curElements })));
	}

	return new Constructor({
		index: input[0].getIndex().take(length),
		values: output,
	});
};
