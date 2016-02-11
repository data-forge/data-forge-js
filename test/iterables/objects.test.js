'use strict';

describe('objects iterable', function () {

	var ObjectsIterable = require('../../src/iterables/objects')

	var expect = require('chai').expect;

	it('there are no columns when input is empty', function () {

		var testObject = new ObjectsIterable([]);
		expect(testObject.getColumnNames()).to.eql([]);
	});

	it('there are no columns when empty objects are input', function () {

		var objects = [{}, {}];

		var testObject = new ObjectsIterable(objects);
		expect(testObject.getColumnNames()).to.eql([]);
	});

	it('can get column names', function () {

		var objects = [
			{
				C1: 1,
				C2: 2,
			},
			{
				C1: 3,
				C2: 4,
			},
		];

		var testObject = new ObjectsIterable(objects);
		var columnNames = ["C1", "C2"];
		expect(testObject.getColumnNames()).to.eql(columnNames);
	});

	it('can handle 0 rows', function () {

		var objects = [];

		var testObject = new ObjectsIterable(objects);
		expect(testObject.getRowsIterator().realize()).to.eql([]);
	});

	it('can iterate rows', function () {

		var objects = [
			{
				C1: 1,
				C2: 2,
			},
			{
				C1: 3,
				C2: 4,
			},
		];

		var testObject = new ObjectsIterable(objects);

		var columnNames = ["C1", "C2"];
		expect(testObject.getRowsIterator().realize()).to.eql([[1, 2], [3, 4]]);
	});

	it('can handle 0 objects', function () {

		var objects = [];

		var testObject = new ObjectsIterable(objects);
		expect(testObject.getObjectsIterator().realize()).to.eql([]);
	});

	it('can iterate objects', function () {

		var objects = [
			{
				C1: 1,
				C2: 2,
			},
			{
				C1: 3,
				C2: 4,
			},
		];

		var testObject = new ObjectsIterable(objects);
		expect(testObject.getObjectsIterator().realize()).to.eql(objects);
	});

});