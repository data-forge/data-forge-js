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
 * Represents a lazy-evaluated series in a data frame.
 */
var LazySeries = function (name, enumeratorFn, indexFn) {
	assert.isString(name, "Expected 'name' parameter to Series constructor be a string.");
	assert.isFunction(enumeratorFn, "Expected 'enumeratorFn' parameter to LazySeries constructor be a function.");

	if (indexFn) {
		assert.isFunction(indexFn, "Expected 'indexFn' parameter to LazySeries constructor to be a function.");
	}

	var self = this;
	self._name = name;
	self._enumeratorFn = enumeratorFn;	
	self._indexFn = indexFn || 
		// Default to generated index range.
		function () {
			return new LazyIndex(
				"__index__",
				function () {
					return new ArrayIterator(E.range(0, self.toValues().length).toArray());
				}
			);
		};
};

var parent = inherit(LazySeries, BaseSeries);

/**
 * Retreive the name of the series.
 */
LazySeries.prototype.getName = function () {
	var self = this;
	return self._name;
}

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