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

/**
 * Set a column as the index of the data frame.
 *
 * @param {string|int} columnNameOrIndex - Name or index of the column to set as the index.
 */
DataFrame.prototype.setIndex = function (columnNameOrIndex) {

	var self = this;
	var columnIndex;
	if (Object.isString(columnNameOrIndex)) {
		columnIndex = self._columnNameToIndex(columnNameOrIndex);
		if (columnIndex < 0) {
			throw new Error("In call to 'getColumn' failed to find column '" + columnNameOrIndex + "'.");
		}
	}
	else {
		assert.isNumber(columnNameOrIndex, "Expected 'columnNameOrIndex' parameter to 'setIndex' to be either a string or integer index that specifies the column to set as the index.");

		columnIndex = columnNameOrIndex;
	}

	var indexValues = E.from(self.getValues())
		.select(function (row) {
			return row[columnIndex];
		})
		.toArray();

	return new DataFrame( //todo: this should be lazy.
		self.getColumnNames(),
		self.getValues(),
		new Index(indexValues)
	);
}

/**
 * Reset the index of the data frame back to the default sequential integer index.
 */
DataFrame.prototype.resetIndex = function () {

	var self = this;
	var values = self.getValues();

	return new DataFrame(
		self.getColumnNames(),
		values,
		new Index(E.range(0, values.length).toArray())
	);
};

module.exports = DataFrame;