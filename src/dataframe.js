'use strict';

//
// Implements a data frame data structure.
//

var BaseDataFrame = require('./basedataframe');
var Index = require('./index');

var assert = require('chai').assert;
var E = require('linq');
var fs = require('fs');
var inherit = require('./inherit');

var DataFrame = function (columnNames, values, index) {
	assert.isArray(columnNames, "Expected 'columnNames' parameter to DataFrame constructor to be an array.");
	assert.isArray(values, "Expected 'values' parameter to DataFrame constructor to be an array.");

	if (index) {
		assert.isObject(index, "Expected 'index' parameter to DataFrame constructor to be an object.");
	}
	
	var self = this;
	self._columnNames = columnNames;
	self._values = values;
	self._index = index || new Index(E.range(0, values.length).toArray());
};

var parent = inherit(DataFrame, BaseDataFrame);

/**
 * Get the index of the data frame.
 */
DataFrame.prototype.getIndex = function () {
	var self = this;
	return self._index;
};

/**
 * Get the names of the columns in the data frame.
 */
DataFrame.prototype.getColumnNames = function () {
	var self = this;
	return self._columnNames;
};

/**
 * Get the values of all rows in the data frame.
 */
DataFrame.prototype.getValues = function () {
	var self = this;
	return self._values;
};

module.exports = DataFrame;