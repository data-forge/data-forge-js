'use strict';

var ArrayIterator = require('./iterators/array');

var assert = require('chai').assert;
var E = require('linq');

var validateIterator = require('./iterators/validate');

/**
 * Base class for indexes.
 *
 * Derives classes must implement:
 *
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

	var Index = require('./index');

	var self = this;
	return new Index({
		getIterator: function () { //todo: make lazy.
			return new ArrayIterator(E.from(self.toValues()).skip(numRows).toArray());
		},
	});
};

/**
 * Take a number of rows from the index.
 *
 * @param {int} numRows - Number of rows to take.
 */
BaseIndex.prototype.take = function (numRows) {
	assert.isNumber(numRows, "Expected 'numRows' parameter to 'take' function to be a number.");	

	var Index = require('./index');

	var self = this;
	return new Index({
		getIterator: function () { //todo: make lazy.
			return new ArrayIterator(E.from(self.toValues()).take(numRows).toArray());
		},
	});
};

/**
 * Create a new index from a slice of rows.
 *
 * @param {int} startIndex - Index where the slice starts.
 * @param {int} endIndex - Marks the end of the slice, one row past the last row to include.
 */
BaseIndex.prototype.slice = function (startIndex, endIndex) {
	assert.isNumber(startIndex, "Expected 'startIndex' parameter to slice to be an integer.");
	assert.isNumber(endIndex, "Expected 'endIndex' parameter to slice to be an integer.");
	assert(endIndex >= startIndex, "Expected 'endIndex' parameter to slice to be greater than or equal to 'startIndex' parameter.");

	var self = this;

	var LazyIndex = require('./lazyindex');

	return new LazyIndex(
		function () {
			return new ArrayIterator(
				E.from(self.toValues())
					.skip(startIndex)
					.take(endIndex - startIndex)
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
	validateIterator(iterator);

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
	return new Index(self.toValues());
};

/**
 * Count the number of rows in the index.
 */
BaseIndex.prototype.count = function () {

	var self = this;
	var total = 0;
	var iterator = self.getIterator();

	while (iterator.moveNext()) {
		++total;
	}

	return total;
};

/**
 * Get the first row of the index.
 */
BaseIndex.prototype.first = function () {

	var self = this;
	var iterator = self.getIterator();

	if (!iterator.moveNext()) {
		throw new Error("No rows in index.");
	}

	return iterator.getCurrent();	
};

/**
 * Get the last row of the index.
 */
BaseIndex.prototype.last = function () {

	var self = this;
	var iterator = self.getIterator();

	if (!iterator.moveNext()) {
		throw new Error("No rows in index.");
	}

	var last = iterator.getCurrent();

	while (iterator.moveNext()) {
		last = iterator.getCurrent();
	}

	return last;
};

/** 
 * Reverse the index.
 */
BaseIndex.prototype.reverse = function () {

	var self = this;

	//todo: make this lazy.

	var Index = require('./index');
	return new Index(E.from(self.toValues()).reverse().toArray());
};

/** 
 * Get X values from the head of the index.
 *
 * @param {int} values - Number of values to take.
 */
BaseIndex.prototype.head = function (values) {

	assert.isNumber(values, "Expected 'values' parameter to 'head' function to be a function.");

	var self = this;
	return self.take(values);
};

/** 
 * Get X values from the tail of the index.
 *
 * @param {int} values - Number of values to take.
 */
BaseIndex.prototype.tail = function (values) {

	assert.isNumber(values, "Expected 'values' parameter to 'tail' function to be a function.");

	var self = this;
	return self.skip(self.count() - values);
};

module.exports = BaseIndex;