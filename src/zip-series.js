'use strict';

var assert = require('chai').assert;
var E = require('linq');
var Series = require('./series.js');

/*
 * Zip together multiple series to create a new series.
 *
 * @param {array} series - Array of series to zip together.
 * @param {function} selector - Selector function that produces a new series based on the input series.
 */
module.exports = function (series, selector) {

	assert.isArray(series, "Expected 'series' parameter to zipSeries to be an array of Series objects.");
	assert.isFunction(selector, "Expected 'selector' parameter to zipSeries to be a function.");

	//todo: make this lazy.

	var seriesToZip = E.from(series)
		.select(function (series) {
			return series.toValues();
		})
		.toArray();

	var length = E.from(seriesToZip).select(function (values) { 
			return values.length; 
		})
		.min();

	var output = [];

	for (var i = 0; i < length; ++i) {
		var curElements = E.from(seriesToZip)
			.select(function (values) {
				return values[i];
			})
			.toArray();
		output.push(selector(curElements));
	}

	return new Series({
		index: series[0].getIndex(),
		values: output,
	});
};
