'use strict';

var SelectIterator = require('../iterators/select');
var ArrayIterator = require('../iterators/array');

var E = require('linq');
var assert = require('chai').assert;

//
// A data-frame iterable for iterating an array of objects.
//
var ObjectsIterable = function (objects) {

	assert.isArray(objects);

	var self = this;
	self._objects = objects;
};

//
// Get the names of the columns being iterated.
//
ObjectsIterable.prototype.getColumnNames = function () {

	var self = this;
	if (!self._columnNames) {
		if (self._objects.length > 0) {
			self._columnNames = Object.keys(self._objects[0]);
		}
		else {
			self._columnNames = [];
		}		
	}

	return self._columnNames;
};

//
// Get an iterator for rows.
//
ObjectsIterable.prototype.getRowsIterator = function () {

	var self = this;
	var columnNames = self.getColumnNames();
	return new SelectIterator(
		self.getObjectsIterator(),
		function (row) {
			return E.from(columnNames)
				.select(function (columnName) {
					return row[columnName];
				})
				.toArray();
		}
	);	
};

//
// Get an iterator for objects.
//
ObjectsIterable.prototype.getObjectsIterator = function () {

	var self = this;
	return new ArrayIterator(self._objects);
};

module.exports = ObjectsIterable;