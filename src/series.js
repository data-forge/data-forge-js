'use strict';

//
// Implements a time series data structure.
//

var BaseSeries = require('./baseseries');
var LazyIndex = require('./lazyindex');
var Index = require('./index');
var ArrayIterator = require('./iterators/array');

var assert = require('chai').assert;
var E = require('linq');
var inherit = require('./inherit');

/**
 * Represents a time series.
 */
var Series = function (config) {

	var self = this;

	if (config) {
		assert.isArray(config.values, "Expected 'values' field of 'config' parameter to Series constructor be an array.");

		self._values = config.values;

		if (config.index) {
			assert.isObject(config.index, "Expected 'index' parameter to Series constructor to be an object.");

			self._index = config.index;
		}
		else {
			// Generate the index.
			self._index = new LazyIndex(
					function () {
						return new ArrayIterator(E.range(0, config.values.length).toArray());
					}
				);
		}
	}
	else {
		self._values = [];
		self._index = new Index([]);
	}
};

var parent = inherit(Series, BaseSeries);

/**
 * Get an iterator for the iterating the values of the series.
 */
Series.prototype.getIterator = function () {
	var self = this;
	return new ArrayIterator(self._values);
};

/**
 * Retreive the index of the series.
 */
Series.prototype.getIndex = function () {
	var self = this;
	return self._index;
};

module.exports = Series;