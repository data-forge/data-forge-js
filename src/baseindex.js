'use strict';

var assert = require('chai').assert;

var assert = require('chai').assert;
var E = require('linq');

/**
 * Base class for indexes.
 *
 * Derives classes must implement:
 *
 *		getValues - Get the array of values from the index.
 */
var BaseIndex = function () {
	
};

/**
 * Skip a number of rows from the index.
 *
 * @param {int} numRows - Number of rows to skip.
 */
BaseIndex.prototype.skip = function (numRows) {
	assert.isNumber(numRows, "Expected 'numRows' parameter to 'skip' function to be a number.");	

	var LazyIndex = require('./lazyindex');

	var self = this;
	return new LazyIndex(
		function () {
			return E.from(self.getValues()).skip(numRows).toArray();
		}
	);
};

/**
 * Take a number of rows from the index.
 *
 * @param {int} numRows - Number of rows to take.
 */
BaseIndex.prototype.take = function (numRows) {
	assert.isNumber(numRows, "Expected 'numRows' parameter to 'take' function to be a number.");	

	var LazyIndex = require('./lazyindex');

	var self = this;
	return new LazyIndex(
		function () {
			return E.from(self.getValues()).take(numRows).toArray();
		}
	);
};

/**
 * Get a subset of rows from the index.
 *
 * @param {int} index - Index where the subset starts.
 * @param {int} count - Number of rows to include in the subset.
 */
BaseIndex.prototype.getRowsSubset = function (index, count) {
	assert.isNumber(index, "Expected 'index' parameter to getRowsSubset to be an integer.");
	assert.isNumber(index, "Expected 'count' parameter to getRowsSubset to be an integer.");

	var self = this;

	var LazyIndex = require('./lazyindex');

	return new LazyIndex(
		function () {
			return E.from(self.getValues())
				.skip(index)
				.take(count)
				.toArray();
		}
	);
};


module.exports = BaseIndex;