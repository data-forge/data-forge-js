'use strict';

var SelectIterator = require('../iterators/select');
var ArrayIterator = require('../iterators/array');

var E = require('linq');
var assert = require('chai').assert;

//
// A data-frame iterable for iterating rows of data.
//
var RowsIterable = function (columnNames, rows) {

	assert.isArray(columnNames);
	assert.isArray(rows);

	var self = this;
	self._columnNames = columnNames;
	self._rows = rows;
};

//
// Get the names of the columns being iterated.
//
RowsIterable.prototype.getColumnNames = function () {

	var self = this;
	return self._columnNames;
};

//
// Get an iterator for rows.
//
RowsIterable.prototype.getRowsIterator = function () {

	var self = this;
	return new ArrayIterator(self._rows);
};

//
// Get an iterator for objects.
//
RowsIterable.prototype.getObjectsIterator = function () {

	var self = this;
	var columnNames = self.getColumnNames();

	return new SelectIterator(
		self.getRowsIterator(),
		function (row) {
			return E.from(columnNames)
				.zip(row, function (columnName, columnValue) {
					return [columnName, columnValue];
				})
				.toObject(
					function (column) {
						return column[0]; // Field name.
					},
					function (column) {
						return column[1]; // Field value.
					}
				);			
		}
	);	
};

module.exports = RowsIterable;