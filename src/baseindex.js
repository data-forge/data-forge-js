'use strict';

var ArrayIterator = require('./iterators/array');

var assert = require('chai').assert;
var E = require('linq');

//
// Helper function to validate an enumerator.
//
var validateEnumerator = function (enumerator) {
	assert.isObject(enumerator, "Expected an 'enumerator' object.");
	assert.isFunction(enumerator.moveNext, "Expected enumerator to have function 'moveNext'.");
	assert.isFunction(enumerator.getCurrent, "Expected enumerator to have function 'getCurrent'.");
};

/**
 * Base class for indexes.
 *
 * Derives classes must implement:
 *
 *		getName - Get the name of theindex.
 *		getEnumerator - Get an enumerator for iterating the values of the index.
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
	var enumerator = self.getEnumerator();
	validateEnumerator(enumerator);

	var values = [];

	while (enumerator.moveNext()) {
		values.push(enumerator.getCurrent());
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