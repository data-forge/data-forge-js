'use strict';

//
// Implements a data frame data structure.
//

var assert = require('chai').assert;
var Series = require('./series');
var E = require('linq');

var DataFrame = function (columnNames, index, values) {
	assert.isArray(columnNames, "Expected 'columnNames' parameter to DataFrame constructor to be an array.");
	assert.isArray(index, "Expected 'index' parameter to DataFrame constructor to be an array.");
	assert.isArray(values, "Expected 'values' parameter to DataFrame constructor to be an array.");
	
	var self = this;
	self._columnNames = columnNames;
	self._index = index;
	self._values = values;	
};

//
// Maps a column name to an array index.
// Returns -1 if the requested column was not found.
//
DataFrame.prototype._columnNameToIndex = function (columnName) {
	assert.isString(columnName, "Expected 'columnName' parameter to _columnNameToIndex to be a non-empty string.");
	
	var self = this;
	for (var i = 0; i < self._columnNames.length; ++i) {
		if (columnName == self._columnNames[i]) {
			return i;
		}
	}	
	
	return -1;
};

DataFrame.prototype.series = function (columnName) {
	var self = this;
	var columnIndex = self._columnNameToIndex(columnName);
	if (columnIndex < 0) {
		throw new Error("In call to 'series' failed to find column with name '" + columnName + "'.");
	}
	
	// Extract values for the column.
	var values = E.from(self._values)
		.select(function (entry) {
			return entry[columnIndex];
		})
		.toArray();
	
	return new Series(self._index, values);
};

DataFrame.prototype.index = function () {
	var self = this;
	return self._index;	
};

DataFrame.prototype.columns = function () {
	var self = this;
	return self._columnNames;
};

DataFrame.prototype.values = function () {
	var self = this;
	return self._values;
};

DataFrame.prototype.subset = function (columnNames) {
	var self = this;
	
	assert.isArray(columnNames, "Expected 'columnName' parameter to 'subset' to be an array.");	
	
	var columnIndices = E.from(columnNames)
		.select(function (columnName) {
			return self._columnNameToIndex(columnName);
		})
		.toArray();
		
	var values = E.from(self._values)
		.select(function (entry) {
			return E.from(columnIndices)
				.select(function (columnIndex) {
					return entry[columnIndex];					
				})
				.toArray();
		})
		.toArray();
	
	return new DataFrame(columnNames, self._index, values);	 
};

module.exports = DataFrame;