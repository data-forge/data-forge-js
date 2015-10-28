'use strict';

// 
// Base class for index classes.
//

var assert = require('chai').assert; 
var E = require('linq');

var BaseIndex = function () {
	
	
};

//
// Skip a number of values in the index.
//
BaseIndex.prototype.skip = function (numValues) {
	assert.isNumber(numValues, "Expected 'numValues' paramater to 'BaseIndex.skip' to be a number, instead it is: " + typeof(numValues));
	
	var LazyIndex = require('./lazyindex');
	
	var self = this;
	return new LazyIndex(
		function () {
			return E.from(self.values()).skip(numValues).toArray()				
		}
		
	); 	
};

// Interface functions.
//
// values - Get the values for each entry in the index.

module.exports = BaseIndex;