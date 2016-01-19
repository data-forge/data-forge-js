'use strict';

//
// Implements a column of a data frame.
//

var BaseColumn = require('./basecolumn');
var LazyIndex = require('./lazyindex');
var ArrayIterator = require('./iterators/array');

var assert = require('chai').assert;
var E = require('linq');
var inherit = require('./inherit');

/**
 * Represents a lazy-evaluated column in a data frame.
 */
var LazyColumn = function (name, seriesFn) {

	assert(arguments.length == 2, "Expected 2 arguments to LazyColumn constructor");	
	assert.isString(name, "Expected 'name' parameter to LazyColumn constructor be a string.");
	assert.isFunction(seriesFn, "Expected 'seriesFn' parameter to LazyColumn constructor be a function.");

	var self = this;
	self._name = name;
	self._seriesFn = seriesFn;
};

var parent = inherit(LazyColumn, BaseColumn);

/**
 * Retreive the name of the column.
 */
LazyColumn.prototype.getName = function () {
	var self = this;
	return self._name;
}

/**
 * Retreive the time-series for the column.
 */
LazyColumn.prototype.getSeries = function () {
	var self = this;
	return self._seriesFn();
}

module.exports = LazyColumn;