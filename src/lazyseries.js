'use strict';

//
// Implements a series of a data frame.
//

var BaseSeries = require('./baseseries');
var Index = require('./index');
var ArrayIterator = require('./iterators/array');

var assert = require('chai').assert;
var E = require('linq');
var inherit = require('./inherit');

/**
 * Represents a lazy-evaluated time-series.
 */
var LazySeries = function (enumeratorFn, index) {
	assert.isFunction(enumeratorFn, "Expected 'enumeratorFn' parameter to LazySeries constructor be a function.");

	if (index) {
		assert.isObject(index, "Expected 'index' parameter to LazySeries constructor to be an index object.");
	}

	var self = this;
	self._enumeratorFn = enumeratorFn;	
	self._index = index || 
		// Default to generated index range.
		new Index({
			getIterator: function () {
				return new ArrayIterator(E.range(0, self.toValues().length).toArray()); //todo: index should use the enumerator.
			},
		});
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
	return self._index;
};

module.exports = LazySeries;