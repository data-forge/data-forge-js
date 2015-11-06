'use strict';

//
// Implements a column of a data frame.
//

var BaseColumn = require('./basecolumn');

var assert = require('chai').assert;
var E = require('linq');
var inherit = require('./inherit');

var LazyColumn = function (name, valuesFn) {
	assert.isString(name, "Expected 'name' parameter to Column constructor be a string.");
	assert.isFunction(valuesFn, "Expected 'valuesFn' parameter to LazyColumn constructor be a function.");

	var self = this;
	self._name = name;
	self._valuesFn = valuesFn;	
};

var parent = inherit(LazyColumn, BaseColumn);

/*
 * Retreive the name of the column.
 */
LazyColumn.prototype.getName = function () {
	var self = this;
	return self._name;
}

/*
 * Retreive the values of the column.
 */
LazyColumn.prototype.getValues = function () {
	var self = this;
	return self._valuesFn();
};

//
// Bake the lazy column to a normal column. 
//
LazyColumn.prototype.bake = function () {
	var Column = require('./column'); // Local require, to prevent circular reference.
	
	var self = this;
	return new Column(self.getName(), self.getValues());
};

module.exports = LazyColumn;