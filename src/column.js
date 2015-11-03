'use strict';

//
// Implements a time series data structure.
//

var BaseColumn = require('./basecolumn');

var assert = require('chai').assert;
var E = require('linq');
var inherit = require('./inherit');

var Column = function (values) {
	assert.isArray(values, "Expected 'values' parameter to Column constructor be an array.");

	var self = this;
	self._values = values;	
};

var parent = inherit(Column, BaseColumn);

Column.prototype.values = function () {
	var self = this;
	return self._values;
};

//
// For compatability with LazyColumn. A Column is already baked, so just return self. 
//
Column.prototype.bake = function () {
	var self = this;
	return self;
};

module.exports = Column;