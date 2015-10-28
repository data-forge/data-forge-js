'use strict';

//
// Implements a lazily evaluated data frame.
//

var LazySeries = require('./lazyseries');
var BaseDataFrame = require('./basedataframe');

var assert = require('chai').assert;
var E = require('linq');
var inherit = require('./inherit');

var LazyDataFrame = function (columnNames, index, valuesFn) {
	assert.isArray(columnNames, "Expected 'columnNames' parameter to LazyDataFrame constructor to be an array.");
	assert.isObject(index, "Expected 'index' parameter to LazyDataFrame constructor be an index object.");
	assert.isFunction(valuesFn, "Expected 'values' parameter to LazyDataFrame constructor to be a function.");
	
	var self = this;
	self._columnNames = columnNames;
	self._index = index;
	self._valuesFn = valuesFn;	
};

var parent = inherit(LazyDataFrame, BaseDataFrame);

LazyDataFrame.prototype.index = function () {
	var self = this;
	return self._index;	
};

LazyDataFrame.prototype.columns = function () {
	var self = this;
	return self._columnNames;
};

LazyDataFrame.prototype.values = function () {
	var self = this;
	return self._valuesFn();
};

//
// Bake the lazy data frame to a normal data frame. 
//
LazyDataFrame.prototype.bake = function () {
	var DataFrame = require('./dataframe'); // Local require, to prevent circular reference.
	
	var self = this;
	return new DataFrame(self._columnNames,	self._index, self.values());
};

module.exports = LazyDataFrame;