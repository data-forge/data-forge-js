'use strict';

var SelectIterator = require('../iterators/select');
var RowArrayIterator = require('../iterators/row-array');

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

RowsIterable.prototype.getIterator = function () {
	var self = this;
	return new RowArrayIterator(self.getColumnNames(), self._rows);
};

module.exports = RowsIterable;