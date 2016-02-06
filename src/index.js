'use strict';

var ArrayIterator = require('./iterators/array');
var SkipIterator = require('./iterators/skip');
var SkipWhileIterator = require('./iterators/skip-while');
var TakeIterator = require('../src/iterators/take');
var TakeWhileIterator = require('../src/iterators/take-while');

var assert = require('chai').assert;
var E = require('linq');

var validateIterator = require('./iterators/validate');

/**
 * Implements an index for a data frame or column.
 */
var Index = function (values) {

	var self = this;

	if (Object.isFunction(values)) {
		self._iterable = values;
	}
	else {
		assert.isArray(values, "Expected 'values' parameter to Index constructor to be an array or an iterable.");

		self._iterable = function () {
			return new ArrayIterator(values);
		};
	}

	assert.isFunction(self._iterable);
};

/**
 * Get an iterator to iterate the values of the index.
 */
Index.prototype.getIterator = function () {
	var self = this;
	return self._iterable();
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
	return new Index(function () {
		return new SkipIterator(self.getIterator(), numRows);
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
	return new Index(function () {
		return new TakeIterator(self.getIterator(), numRows);
	});
};

/**
 * Create a new index from a slice of rows.
 *
 * @param {int|function} startIndexOrStartPredicate - Index where the slice starts or a predicate function that determines where the slice starts.
 * @param {int|function} endIndexOrEndPredicate - Marks the end of the slice, one row past the last row to include. Or a predicate function that determines when the slice has ended.
 * @param {function} [predicate] - Optional predicate to compare index against start/end index. Return true to start or stop the slice.
 */
Index.prototype.slice = function (startIndexOrStartPredicate, endIndexOrEndPredicate, predicate) {

	var self = this;

	var startIndex;
	var endIndex;
	var startPredicate = null;
	var endPredicate = null;

	if (predicate) {
		assert.isFunction(predicate, "Expected 'predicate' parameter to slice function to be function.");
	}

	if (Object.isFunction(startIndexOrStartPredicate)) {
		startPredicate = startIndexOrStartPredicate;
	}
	else {
		startIndex = startIndexOrStartPredicate;
		startPredicate = function (value) {
				return predicate && predicate(value, startIndex) || value < startIndex;
			};
	}

	if (Object.isFunction(endIndexOrEndPredicate)) {
		endPredicate = endIndexOrEndPredicate;
	}
	else {
		endIndex = endIndexOrEndPredicate;
		endPredicate = function (value) {
				return predicate && predicate(value, endIndex) || value < endIndex;
			};
	}

	return new Index(function () {
		return new TakeWhileIterator(
			new SkipWhileIterator(
				self.getIterator(),
				startPredicate					
			),
			endPredicate
		)
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