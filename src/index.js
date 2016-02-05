'use strict';

var ArrayIterator = require('./iterators/array');
var ArrayIterable = require('./iterables/array');
var checkIterable = require('./iterables/check');
var validateIterable = require('./iterables/validate');
var SkipIterator = require('./iterators/skip');
var TakeIterator = require('../src/iterators/take');

var assert = require('chai').assert;
var E = require('linq');

var validateIterator = require('./iterators/validate');

/**
 * Implements an index for a data frame or column.
 */
var Index = function (values) {

	var self = this;

	if (checkIterable(values)) {
		self._iterable = values;
	}
	else {
		assert.isArray(values, "Expected 'values' parameter to Index constructor to be an array or an iterable.");

		self._iterable = new ArrayIterable(values);
	}

	validateIterable(self._iterable);
};

/**
 * Get an iterator to iterate the values of the index.
 */
Index.prototype.getIterator = function () {
	var self = this;
	return self._iterable.getIterator();
};

/**
 * Skip a number of rows from the index.
 *
 * @param {int} numRows - Number of rows to skip.
 */
Index.prototype.skip = function (numRows) {
	assert.isNumber(numRows, "Expected 'numRows' parameter to 'skip' function to be a number.");	

	var Index = require('./index');

	var self = this;
	return new Index({
		getIterator: function () {
			return new SkipIterator(self.getIterator(), numRows);
		},
	});
};

/**
 * Take a number of rows from the index.
 *
 * @param {int} numRows - Number of rows to take.
 */
Index.prototype.take = function (numRows) {
	assert.isNumber(numRows, "Expected 'numRows' parameter to 'take' function to be a number.");	

	var self = this;
	return new Index({
		getIterator: function () {
			return new TakeIterator(self.getIterator(), numRows);
		},
	});
};

/**
 * Create a new index from a slice of rows.
 *
 * @param {int} startIndex - Index where the slice starts.
 * @param {int} endIndex - Marks the end of the slice, one row past the last row to include.
 */
Index.prototype.slice = function (startIndex, endIndex) {
	assert.isNumber(startIndex, "Expected 'startIndex' parameter to slice to be an integer.");
	assert.isNumber(endIndex, "Expected 'endIndex' parameter to slice to be an integer.");
	assert(endIndex >= startIndex, "Expected 'endIndex' parameter to slice to be greater than or equal to 'startIndex' parameter.");

	var self = this;

	return new Index({
		getIterator: function () { //todo: make lazy.
			return new ArrayIterator(
				E.from(self.toValues())
					.skip(startIndex)
					.take(endIndex - startIndex)
					.toArray()
			);
		},
	});
};

/*
 * Extract values from the index. This forces lazy evaluation to complete.
 */
Index.prototype.toValues = function () {

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
Index.prototype.bake = function () {

	var self = this;
	return new Index(self.toValues());
};

/**
 * Count the number of rows in the index.
 */
Index.prototype.count = function () {

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
Index.prototype.first = function () {

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
Index.prototype.last = function () {

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
Index.prototype.reverse = function () {

	var self = this;
	return new Index(E.from(self.toValues()).reverse().toArray());
};

/** 
 * Get X values from the head of the index.
 *
 * @param {int} values - Number of values to take.
 */
Index.prototype.head = function (values) {

	assert.isNumber(values, "Expected 'values' parameter to 'head' function to be a function.");

	var self = this;
	return self.take(values);
};

/** 
 * Get X values from the tail of the index.
 *
 * @param {int} values - Number of values to take.
 */
Index.prototype.tail = function (values) {

	assert.isNumber(values, "Expected 'values' parameter to 'tail' function to be a function.");

	var self = this;
	return self.skip(self.count() - values);
};

module.exports = Index;