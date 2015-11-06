'use strict';

//
// Implements a time series data structure.
//

var BaseColumn = require('./basecolumn');

var assert = require('chai').assert;
var E = require('linq');
var inherit = require('./inherit');

var Column = function (name, values) {
	assert.isString(name, "Expected 'name' parameter to Column constructor be a string.");
	assert.isArray(values, "Expected 'values' parameter to Column constructor be an array.");

	var self = this;
	self._name = name;
	self._values = values;	
};

var parent = inherit(Column, BaseColumn);

/*
 * Retreive the name of the column.
 */
Column.prototype.getName = function () {
	var self = this;
	return self._name;
}

/*
 * Retreive the values of the column.
 */
Column.prototype.getValues = function () {
	var self = this;
	return self._values;
};

module.exports = Column;