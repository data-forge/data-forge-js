'use strict';

describe('rows iterable', function () {

	var RowsIterable = require('../../src/iterables/rows')

	var expect = require('chai').expect;

	it('can handle zero columns', function () {

		var testObject = new RowsIterable([], []);
		expect(testObject.getColumnNames()).to.eql([]);
	});

	it('can get column names', function () {

		var columnNames = ["C1", "C2"];
		var testObject = new RowsIterable(columnNames, []);
		expect(testObject.getColumnNames()).to.eql(columnNames);
	});

	it('can handle 0 rows', function () {

		var columnNames = ["C1", "C2"];
		var testObject = new RowsIterable(columnNames, []);
		expect(testObject.getRowsIterator().realize()).to.eql([]);
	});

	it('can iterate rows', function () {

		var columnNames = ["C1", "C2"];
		var rows = [[1, 2], [3, 4]];
		var testObject = new RowsIterable(columnNames, rows);
		expect(testObject.getRowsIterator().realize()).to.eql(rows);
	});

	it('can handle 0 objects', function () {

		var columnNames = ["C1", "C2"];
		var testObject = new RowsIterable(columnNames, []);
		expect(testObject.getObjectsIterator().realize()).to.eql([]);
	});

	it('can iterate objects', function () {

		var columnNames = ["C1", "C2"];
		var rows = [[1, 2], [3, 4]];
		var testObject = new RowsIterable(columnNames, rows);
		expect(testObject.getObjectsIterator().realize()).to.eql([
			{
				C1: 1,
				C2: 2,
			},
			{
				C1: 3,
				C2: 4,
			},
		]);
	});

});