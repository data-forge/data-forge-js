'use strict';

// 
// Base class for columns classes.
//

var assert = require('chai').assert; 
var E = require('linq');


/**
 * Base class for columns.
 */
var BaseColumn = function () {
	
	
};

//
// Skip a number of rows in the series.
//
BaseColumn.prototype.skip = function (numRows) {
	var LazyColumn = require('./lazycolumn'); // Require here to prevent circular ref.
	
	var self = this;
	return new LazyColumn(
		self.getName(),
		function () {
			return E
				.from(self.getValues())
				.skip(numRows)
				.toArray();			
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

//
// Interface functions.
//
// getName - Get the name of the column.
// getValues - Get the values for each entry in the series.
//

module.exports = BaseColumn;