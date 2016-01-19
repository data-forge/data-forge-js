'use strict';

//
// Implements a series of a data frame.
//

var BaseSeries = require('./baseseries');
var LazyIndex = require('./lazyindex');
var ArrayIterator = require('./iterators/array');

var assert = require('chai').assert;
var E = require('linq');
var inherit = require('./inherit');

/**
 * Represents a lazy-evaluated time-series.
 */
var LazySeries = function (enumeratorFn, indexFn) {
	assert.isFunction(enumeratorFn, "Expected 'enumeratorFn' parameter to LazySeries constructor be a function.");

	if (indexFn) {
		assert.isFunction(indexFn, "Expected 'indexFn' parameter to LazySeries constructor to be a function.");
	}

	var self = this;
	self._enumeratorFn = enumeratorFn;	
	self._indexFn = indexFn || 
		// Default to generated index range.
		function () {
			return new LazyIndex(
				function () {
					return new ArrayIterator(E.range(0, self.toValues().length).toArray());
				}
			);
		};
};

var parent = inherit(LazySeries, BaseSeries);

/**
 * Get an iterator for the iterating the values of the series.
 */
LazySeries.prototype.getIterator = function () {
	var self = this;
	return self._enumeratorFn();
};

/*
 * Retreive the index for this series.
 */
LazySeries.prototype.getIndex = function () {
	var self = this;
	return self._indexFn();
};

module.exports = LazySeries;