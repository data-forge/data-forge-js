'use strict';

var assert = require('chai').assert;
var E = require('linq');
var Series = require('./series');
var ConcatIterator = require('./iterators/concat');

/**
 * Concatenate multiple series into a single series.
 *
 * @param {array} series - Array of series to concatenate.
 */
module.exports = function (series) {
	assert.isArray(series, "Expected 'series' parameter to 'dataForge.concatSeries' to be an array of series.");

	return new Series({
		iterable: {
			getIterator: function () {
				var iterators = E.from(series)
					.select(function (series) {
						return series.getIterator();
					})						
					.toArray()
				return new ConcatIterator(iterators);
			},
		},
	});
};
