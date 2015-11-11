'use strict';

// 
// Base class for columns classes.
//

var assert = require('chai').assert; 
var E = require('linq');


/**
 * Base class for columns.
 *
 * getName - Get the name of the column.
 * getValues - Get the values for each entry in the series.
 * getIndex - Get the index for the column.
 */
var BaseColumn = function () {	
	
};

/**
 * Skip a number of rows in the column.
 *
 * @param {int} numRows - Number of rows to skip.
 */
BaseColumn.prototype.skip = function (numRows) {
	assert.isNumber(numRows, "Expected 'numRows' parameter to 'skip' function to be a number.");

	var LazyColumn = require('./lazycolumn'); // Require here to prevent circular ref.
	
	var self = this;
	return new LazyColumn(
		self.getName(),
		function () {
			return E
				.from(self.getValues())
				.skip(numRows)
				.toArray();	numRows		
		},
		function () {
			return self.getIndex().skip(numRows);
		}
	); 	
};

//
// Orders a series based on values in asscending order.
//
var order = function (self, sortMethod) {

	assert.isObject(self);
	assert.isString(sortMethod);
	assert(sortMethod === 'orderBy' || sortMethod === 'orderByDescending');
	
	var cachedSorted = null;
	
	//
	// Lazily execute the sort when needed.
	//
	var executeLazySort = function () {
		if (!cachedSorted) {
			cachedSorted = E.from(self.getValues())
				[sortMethod](function (value) {
					return value;
				})
				.toArray();
		}
		
		return cachedSorted;
	}
	
	var LazyColumn = require('./lazycolumn'); // Require here to prevent circular ref.

	return new LazyColumn(
		self.getName(),
		function () {
			return executeLazySort();			
		}
	);
};

/**
 * Orders a series based on values in asscending order.
 */
BaseColumn.prototype.order = function () {
	var self = this;
	return order(self, 'orderBy');
};

/**
 * Orders a series based on values in descending order.
 */
BaseColumn.prototype.orderDescending = function () {
	var self = this;
	return order(self, 'orderByDescending');
};

/**
 * Get a subset of rows from the column.
 *
 * @param {int} index - Index where the subset starts.
 * @param {int} count - Number of rows to include in the subset.
 */
BaseColumn.prototype.getRowsSubset = function (index, count) {
	assert.isNumber(index, "Expected 'index' parameter to getRowsSubset to be an integer.");
	assert.isNumber(index, "Expected 'count' parameter to getRowsSubset to be an integer.");

	var self = this;

	var LazyColumn = require('./lazycolumn'); // Require here to prevent circular ref.

	return new LazyColumn(
		self.getName(),
		function () {
			return E.from(self.getValues())
				.skip(index)
				.take(count)
				.toArray();
		},
		function () {
			return self.getIndex().getRowsSubset(index, count);
		}
	);
};

/** todo:
 * Execute code over a moving window to produce a new data frame.
 *
 * @param {integer} period - The number of entries to include in the window.
 * @param {function} fn - The function to invoke on each window.
 */
BaseColumn.prototype.rollingWindow = function (period, fn) {

	assert.isNumber(period, "Expected 'period' parameter to 'rollingWindow' to be a number.");
	assert.isFunction(fn, "Expected 'fn' parameter to 'rollingWindow' to be a function.");

	var self = this;

	var values = self.getValues();

	var Column = require('./column');

	if (values.length == 0) {
		return new Column(self.getName(), []);
	}

	var newValues = E.range(0, values.length-period+1)
		.select(function (i) {
			var window = E.from(values).skip(i).take(period).toArray();
			return fn(window);
		})
		.toArray();

	return new Column(self.getName(), newValues);
};

module.exports = BaseColumn;