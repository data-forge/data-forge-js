'use strict';

// 
// Base class for series classes.
//

var assert = require('chai').assert; 
var E = require('linq');

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
		self.index().skip(numRows),
		function () {
			return E
				.from(self.values())
				.skip(numRows)
				.toArray();			
		}
	); 	
};


// Interface functions.
//
// index - Get the index for the series.
// values - Get the values for each entry in the series.
// bake - Force lazy evaluation to complete.
//

module.exports = BaseSeries;