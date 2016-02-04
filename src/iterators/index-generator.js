'use strict';

var assert = require('chai').assert;

//
// Data-forge enumerator for generating an infinite index.
//
var IndexGeneratorIterator = function () {

	var self = this;

	var cur = -1;
	
	self.moveNext = function () {
		++cur;
		return true;
	};

	self.getCurrent = function () {
		if (cur >= 0) {
			return cur;			
		}
		else {
			return undefined;
		}
	};
};

module.exports = IndexGeneratorIterator;