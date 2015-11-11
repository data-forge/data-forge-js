'use strict';

//
// Implements a time series data structure.
//

var BaseColumn = require('./basecolumn');
var LazyIndex = require('./lazyindex');

var assert = require('chai').assert;
var E = require('linq');
var inherit = require('./inherit');

/**
 * Represents a column in a data frame.
 */
var Column = function (name, values, index) {
	assert.isString(name, "Expected 'name' parameter to Column constructor be a string.");
	assert.isArray(values, "Expected 'values' parameter to Column constructor be an array.");

	if (index) {
		assert.isObject(index, "Expected 'index' parameter to Column constructor to be an object.");
	}

	var self = this;
	self._name = name;
	self._values = values;	
	self._index = index || new LazyIndex(function () {
		return E.range(0, values.length).toArray();
	});
};

var parent = inherit(Column, BaseColumn);

/**
 * Retreive the name of the column.
 */
Column.prototype.getName = function () {
	var self = this;
	return self._name;
}

/**
 * Retreive the values of the column.
 */
Column.prototype.getValues = function () {
	var self = this;
	return self._values;
};

/**
 * Retreive the index of the column.
 */
Column.prototype.getIndex = function () {
	var self = this;
	return self._index;
};

module.exports = Column;