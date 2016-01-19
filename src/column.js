'use strict';

//
// Implements a time series data structure.
//

var LazyIndex = require('./lazyindex');
var ArrayIterator = require('./iterators/array');

var assert = require('chai').assert;
var E = require('linq');
var inherit = require('./inherit');

/**
 * Represents a column in a data frame.
 */
var Column = function (name, series) {

	assert(arguments.length == 2, "Expected 2 arguments to Column constructor");
	assert.isString(name, "Expected 'name' parameter to Column constructor be a string.");
	assert.isObject(series, "Expected 'series' parameter to Column constructor be an time-series object.");

	var self = this;
	self._name = name;
	self._series = series;	
};

/**
 * Retreive the name of the column.
 */
Column.prototype.getName = function () {
	var self = this;
	return self._name;
};

/**
 * Retreive the time-series for the column.
 */
Column.prototype.getSeries = function () {
	var self = this;
	return self._series;
};

/** 
 * Format the column for display as a string.
 */
Column.prototype.toString = function () {

	var self = this;
	var Table = require('easy-table');

	var index = self.getIndex().toValues();
	var header = [self.getIndex().getName(), self.getName()];
	var rows = E.from(self.getSeries().toValues())
			.select(function (value, rowIndex) { 
				return [index[rowIndex], value];
			})
			.toArray()

	var t = new Table();
	rows.forEach(function (row, rowIndex) {
		row.forEach(function (cell, cellIndex) {
			t.cell(header[cellIndex], cell);
		});
		t.newRow();
	});

	return t.toString();
};

module.exports = Column;