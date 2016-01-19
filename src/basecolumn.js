'use strict';

// 
// Base class for columns classes.
//

var assert = require('chai').assert; 
var E = require('linq');
var moment = require('moment');
var ArrayIterator = require('./iterators/array');

//
// Helper function to validate an iterator.
//
var validateIterator = function (iterator) {
	assert.isObject(iterator, "Expected an 'iterator' object.");
	assert.isFunction(iterator.moveNext, "Expected iterator to have function 'moveNext'.");
	assert.isFunction(iterator.getCurrent, "Expected iterator to have function 'getCurrent'.");
};

/**
 * Base class for columns.
 *
 * getName - Get the name of the column.
 * getSeries - Get the time-series for the column.
 */
var BaseColumn = function () {	
	
};

/** 
 * Format the data frame for display as a string.
 */
BaseColumn.prototype.toString = function () {

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

module.exports = BaseColumn;