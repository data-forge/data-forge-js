'use strict';

// 
// Base class for series classes.
//

var NumberIndex = require('./numberindex');

var assert = require('chai').assert; 
var E = require('linq');


/**
 * Base class for series.
 */
var BaseSeries = function () {
	
	
};

//
// Get all data as an array of arrays (includes index and values).
//
BaseSeries.prototype.rows = function () {
	var self = this;
	return E
		.from(self.index().values())
		.zip(self.values(), function (index, value) {
			return [index, value];
		})
		.toArray();
};

//
// Skip a number of rows in the series.
//
BaseSeries.prototype.skip = function (numRows) {
	var LazySeries = require('./lazyseries'); // Require here to prevent circular ref.
	
	var self = this;
	return new LazySeries(
		function () {
			return self.index().skip(numRows);	
		},		
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
	var LazySeries = require('./lazyseries'); // Require here to prevent circular ref.
	var LazyIndex = require('./lazyindex'); // Require here to prevent circular ref.
	
	//todo: would be nice to sort both arrays independently.
	
	var cachedSorted = null;
	
	var sorted = function () {
		if (!cachedSorted) {
			cachedSorted = E.from(self.index().values())
				.zip(E.from(self.values()), function (index, value) {
					return [index, value];
				})
				[sortMethod](function (pair) {
					return pair[1];
				})
				.toArray();
		}
		
		return cachedSorted;
	}
	
	return new LazySeries(
		function () {
			return new LazyIndex(
				function () {
					return E.from(sorted())
						.select(function (row) {
							return row[0];
						})
						.toArray();
					
				}				
			);
		},
		function () {
			return E.from(sorted())
				.select(function (row) {
					return row[1];
				})
				.toArray();
			
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

// Interface functions.
//
// index - Get the index for the series.
// values - Get the values for each entry in the series.
// bake - Force lazy evaluation to complete.
//

module.exports = BaseSeries;