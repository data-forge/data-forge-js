'use strict';

//
// Implements a column of a data frame.
//

var BaseColumn = require('./basecolumn');

var assert = require('chai').assert;
var E = require('linq');
var inherit = require('./inherit');

var LazyColumn = function (valuesFn) {
	assert.isFunction(valuesFn, "Expected 'valuesFn' parameter to LazyColumn constructor be a function.");

	var self = this;
	self._valuesFn = valuesFn;	
};

var parent = inherit(LazyColumn, BaseColumn);

LazyColumn.prototype.values = function () {
	var self = this;
	return self._valuesFn();
};

//
// Bake the lazy column to a normal column. 
//
LazyColumn.prototype.bake = function () {
	var Column = require('./column'); // Local require, to prevent circular reference.
	
	var self = this;
	return new Column(self.values());
};

module.exports = LazyColumn;