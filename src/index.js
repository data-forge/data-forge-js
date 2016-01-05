'use strict';

var BaseIndex = require('./baseindex');
var ArrayIterator = require('./iterators/array');

var assert = require('chai').assert;
var E = require('linq');
var inherit = require('./inherit');

/**
 * Implements an index for a data frame or column.
 */
var Index = function (name, values) {
	assert.isString(name, "Expected 'name' parameter to Index constructor to be a string.");
	assert.isArray(values, "Expected 'values' parameter to Index constructor to be an array.");

	var self = this;
	self._name = name;
	self._values = values;
};

var parent = inherit(Index, BaseIndex);

/**
 * Get the name of the index.
 */
Index.prototype.getName = function () {
	var self = this;
	return self._name;
};

/**
 * Get an enumerator to iterate the values of the index.
 */
Index.prototype.getEnumerator = function () {
	var self = this;
	return new ArrayIterator(self._values);
};

module.exports = Index;