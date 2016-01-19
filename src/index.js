'use strict';

var BaseIndex = require('./baseindex');
var ArrayIterator = require('./iterators/array');

var assert = require('chai').assert;
var E = require('linq');
var inherit = require('./inherit');

/**
 * Implements an index for a data frame or column.
 */
var Index = function (values) {
	assert.isArray(values, "Expected 'values' parameter to Index constructor to be an array.");

	var self = this;
	self._values = values;
};

var parent = inherit(Index, BaseIndex);

/**
 * Get an iterator to iterate the values of the index.
 */
Index.prototype.getIterator = function () {
	var self = this;
	return new ArrayIterator(self._values);
};

module.exports = Index;