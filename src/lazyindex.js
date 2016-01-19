'use strict';

var BaseIndex = require('./baseindex');
var ArrayIterator = require('./iterators/array');

var assert = require('chai').assert;
var E = require('linq');
var inherit = require('./inherit');

/**
 * Implements an lazy-evaluated index for a data frame or column.
 */
var LazyIndex = function (enumeratorFn) {
	assert.isFunction(enumeratorFn, "Expected 'enumeratorFn' parameter to LazyIndex constructor to be a function.");

	var self = this;
	self._enumeratorFn = enumeratorFn;
};

var parent = inherit(LazyIndex, BaseIndex);

/**
 * Get an iterator to iterate the values of the index.
 */
LazyIndex.prototype.getIterator = function () {
	var self = this;
	return self._enumeratorFn();
};

module.exports = LazyIndex;