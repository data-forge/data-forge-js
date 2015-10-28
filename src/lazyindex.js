'use strict';

//
// A lazyily evaluated index.
//

//todo: test me

var assert = require('chai').assert;
var E = require('linq');
var BaseIndex = require('./baseindex');
var inherit = require('./inherit');

var LazyIndex = function (valuesFn) {
	assert.isFunction(valuesFn, "Expected 'valuesFn' parameter to LazyIndex constructor to be a function.");
	
	var self = this;
	self._valuesFn = valuesFn;	
};

var parent = inherit(LazyIndex, BaseIndex);

LazyIndex.prototype.values = function () {
	var self = this;
	return self._valuesFn();	
};

module.exports = LazyIndex;