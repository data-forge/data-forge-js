'use strict';

var BaseIndex = require('./baseindex');
var ArrayIterable = require('./iterables/array');
var checkIterable = require('./iterables/check');
	var validateIterable = require('./iterables/validate');

var assert = require('chai').assert;
var E = require('linq');
var inherit = require('./inherit');

/**
 * Implements an index for a data frame or column.
 */
var Index = function (values) {

	var self = this;

	if (checkIterable(values)) {
		self._iterable = values;
	}
	else {
		assert.isArray(values, "Expected 'values' parameter to Index constructor to be an array or an iterable.");

		self._iterable = new ArrayIterable(values);
	}

	validateIterable(self._iterable);
};

var parent = inherit(Index, BaseIndex);

/**
 * Get an iterator to iterate the values of the index.
 */
Index.prototype.getIterator = function () {
	var self = this;
	return self._iterable.getIterator();
};

module.exports = Index;