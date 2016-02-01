'use strict';

//
// Implements a time series data structure.
//

var BaseSeries = require('./baseseries');
var LazyIndex = require('./lazyindex');
var Index = require('./index');
var ArrayIterator = require('./iterators/array');
var ArrayIterable = require('./iterables/array');
var checkIterable = require('./iterables/check');
var validateIterable = require('./iterables/validate');

var assert = require('chai').assert;
var E = require('linq');
var inherit = require('./inherit');

/**
 * Represents a time series.
 */
var Series = function (config) {

	var self = this;

	if (config) {

		if (!config.values) {
			throw new Error("Expected 'values' field to be set on 'config' parameter to Series constructor.");
		}

		if (checkIterable(config.values)) {
			self._iterable = config.values;
		}
		else {
			assert.isArray(config.values, "Expected 'values' field of 'config' parameter to Series constructor be an array or an iterable.");

			self._iterable = new ArrayIterable(config.values);
		}		

		if (config.index) {
			assert.isObject(config.index, "Expected 'index' parameter to Series constructor to be an object.");

			self._index = config.index;
		}
		else {
			// Generate the index.
			self._index = new LazyIndex(
					function () {
						var iterator = self._iterable.getIterator();
						var length = 0;
						while (iterator.moveNext()) {
							++length;
						}
						return new ArrayIterator(E.range(0, length).toArray());
					}
				);
		}
	}
	else {
		self._iterable = new ArrayIterable([]);
		self._index = new Index([]);
	}

	validateIterable(self._iterable);
};

var parent = inherit(Series, BaseSeries);

/**
 * Get an iterator for the iterating the values of the series.
 */
Series.prototype.getIterator = function () {
	var self = this;
	return self._iterable.getIterator();
};

/**
 * Retreive the index of the series.
 */
Series.prototype.getIndex = function () {
	var self = this;
	return self._index;
};

module.exports = Series;