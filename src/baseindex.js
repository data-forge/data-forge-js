'use strict';

var ArrayIterator = require('./iterators/array');

var assert = require('chai').assert;
var E = require('linq');

//
// Helper function to validate an iterator.
//
var validateEnumerator = function (iterator) {
	assert.isObject(iterator, "Expected an 'iterator' object.");
	assert.isFunction(iterator.moveNext, "Expected iterator to have function 'moveNext'.");
	assert.isFunction(iterator.getCurrent, "Expected iterator to have function 'getCurrent'.");
};

/**
 * Base class for indexes.
 *
 * Derives classes must implement:
 *
 *		getName - Get the name of theindex.
 *		getIterator - Get an iterator for iterating the values of the index.
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
		self.getName(),
		function () {
			return new ArrayIterator(E.from(self.toValues()).skip(numRows).toArray());
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
		self.getName(),
		function () {
			return new ArrayIterator(E.from(self.toValues()).take(numRows).toArray());
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
		self.getName(),
		function () {
			return new ArrayIterator(E.from(self.toValues())
				.skip(index)
				.take(count)
				.toArray()
			);
		}
	);
};

/*
 * Extract values from the index. This forces lazy evaluation to complete.
 */
BaseIndex.prototype.toValues = function () {

	var self = this;
	var iterator = self.getIterator();
	validateEnumerator(iterator);

	var values = [];

	while (iterator.moveNext()) {
		values.push(iterator.getCurrent());
	}

	return values;
};

/*
 * Forces lazy evaluation to complete and 'bakes' the index into memory.
 */
BaseIndex.prototype.bake = function () {

	var self = this;

	var Index = require('./index');
	return new Index(self.getName(), self.toValues());
};

module.exports = BaseIndex;