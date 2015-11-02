'use strict';

// 
// Base class for series classes.
//

var assert = require('chai').assert; 
var E = require('linq');


/**
 * Base class for series.
 */
var BaseSeries = function () {
	
	
};

//
// Skip a number of rows in the series.
//
BaseSeries.prototype.skip = function (numRows) {
	var LazySeries = require('./lazyseries'); // Require here to prevent circular ref.
	
	var self = this;
	return new LazySeries(
		function () {
			return E
				.from(self.values())
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
			cachedSorted = E.from(self.values())
				[sortMethod](function (value) {
					return value;
				})
				.toArray();
		}
		
		return cachedSorted;
	}
	
	var LazySeries = require('./lazyseries'); // Require here to prevent circular ref.

	return new LazySeries(
		function () {
			return executeLazySort();			
		}
	);
};

/**
 * Orders a series based on values in asscending order.
 */
BaseSeries.prototype.order = function () {
	var self = this;
	return order(self, 'orderBy');
};

/**
 * Orders a series based on values in descending order.
 */
BaseSeries.prototype.orderDescending = function () {
	var self = this;
	return order(self, 'orderByDescending');
};

//
// Interface functions.
//
// values - Get the values for each entry in the series.
// bake - Force lazy evaluation to complete.
//

module.exports = BaseSeries;