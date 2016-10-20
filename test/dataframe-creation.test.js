'use strict';

describe('dataframe creation', function () {

	var expect = require('chai').expect;

	var DataFrame = require('../src/dataframe');
	var Series = require('../src/series');
	var ArrayIterator = require('../src/iterators/array');

	it('can create from rows', function () {

		var columnNames = ["c1", "c2"];
		var dataFrame = new DataFrame({
			columnNames: columnNames,
			values: [
				[1, 2],
				[3, 4],
			],
		});

		expect(dataFrame.getColumnNames()).to.eql(columnNames);
		expect(dataFrame.toPairs()).to.eql([
			[0, { c1: 1, c2: 2 }],
			[1, { c1: 3, c2: 4 }],
		]);
	});

	it('can create from rows with index', function () {

		var columnNames = ["c1", "c2"];
		var dataFrame = new DataFrame({
			columnNames: columnNames,
			values: [
				[1, 2],
				[3, 4],
			],
			index: new Series({ values: [10, 11] }),
		});

		expect(dataFrame.getColumnNames()).to.eql(columnNames);
		expect(dataFrame.toPairs()).to.eql([
			[10, { c1: 1, c2: 2 }],
			[11, { c1: 3, c2: 4 }],
		]);
	});

	it('can create from rows with array index', function () {

		var columnNames = ["c1", "c2"];
		var dataFrame = new DataFrame({
			columnNames: columnNames,
			values: [
				[1, 2],
				[3, 4],
			],
			index: [10, 11]
		});

		expect(dataFrame.getColumnNames()).to.eql(columnNames);
		expect(dataFrame.toPairs()).to.eql([
			[10, { c1: 1, c2: 2 }],
			[11, { c1: 3, c2: 4 }],
		]);
	});

	it('can create from objects', function () {
		
		var dataFrame = new DataFrame({
			values: [
				{ c1: 1, c2: 2 },
				{ c1: 3, c2: 4 },
			],
		});

		var columnNames = ["c1", "c2"];
		expect(dataFrame.getColumnNames()).to.eql(columnNames);
		expect(dataFrame.toPairs()).to.eql([
			[0, { c1: 1, c2: 2 }],
			[1, { c1: 3, c2: 4 }],
		]);
	});

	it('can create from simple array of objects', function () {
		
		var dataFrame = new DataFrame([
			{ c1: 1, c2: 2 },
			{ c1: 3, c2: 4 },
		]);

		var columnNames = ["c1", "c2"];
		expect(dataFrame.getColumnNames()).to.eql(columnNames);
		expect(dataFrame.toPairs()).to.eql([
			[0, { c1: 1, c2: 2 }],
			[1, { c1: 3, c2: 4 }],
		]);
	});

	it('creating from objects with variable fields - by default just uses first row to determine column names', function () {
		
		var dataFrame = new DataFrame({
			values: [
				{ c1: 1, c2: 2 },
				{ c3: 3, c4: 4 },
			],
		});

		var columnNames = ["c1", "c2"];
		expect(dataFrame.getColumnNames()).to.eql(columnNames);
		expect(dataFrame.toPairs()).to.eql([
			[0, { c1: 1, c2: 2 }],
			[1, { c3: 3, c4: 4 }],
		]);
	});

	it('creating from objects with variable fields - can force all rows to be considered to determine column names', function () {
		
		var dataFrame = new DataFrame({
			values: [
				{ c1: 1, c2: 2 },
				{ c3: 3, c4: 4 },
			],
			considerAllRows: true,
		});

		var columnNames = ["c1", "c2", "c3", "c4"];
		expect(dataFrame.getColumnNames()).to.eql(columnNames);
		expect(dataFrame.toPairs()).to.eql([
			[0, { c1: 1, c2: 2 }],
			[1, { c3: 3, c4: 4 }],
		]);
	});

	it('creating from objects with variable fields - can force all rows to be considered to determine column names - rows come from function', function () {
		
		var dataFrame = new DataFrame({
			values: function () {
				return new ArrayIterator([
					{ c1: 1, c2: 2 },
					{ c3: 3, c4: 4 },
				]);
			},
			considerAllRows: true,
		});

		var columnNames = ["c1", "c2", "c3", "c4"];
		expect(dataFrame.getColumnNames()).to.eql(columnNames);
		expect(dataFrame.toPairs()).to.eql([
			[0, { c1: 1, c2: 2 }],
			[1, { c3: 3, c4: 4 }],
		]);
	});

	it('can create from objects with index', function () {
		
		var dataFrame = new DataFrame({
			values: [
				{ c1: 1, c2: 2 },
				{ c1: 3, c2: 4 },
			],
			index: new Series({ values: [10, 11] }),
		});

		var columnNames = ["c1", "c2"];
		expect(dataFrame.getColumnNames()).to.eql(columnNames);
		expect(dataFrame.toPairs()).to.eql([
			[10, { c1: 1, c2: 2 }],
			[11, { c1: 3, c2: 4 }],
		]);
	});

	it('can create from objects with array index', function () {
		
		var dataFrame = new DataFrame({
			values: [
				{ c1: 1, c2: 2 },
				{ c1: 3, c2: 4 },
			],
			index: [10, 11],
		});

		var columnNames = ["c1", "c2"];
		expect(dataFrame.getColumnNames()).to.eql(columnNames);
		expect(dataFrame.toPairs()).to.eql([
			[10, { c1: 1, c2: 2 }],
			[11, { c1: 3, c2: 4 }],
		]);
	});

	it('can create from index/value iterable', function () {
		
		var columnNames = ["c1", "c2"];
		var dataFrame = new DataFrame({
			iterable: {
				getIterator: function () {
					return new ArrayIterator([
						[20, { c1: 1, c2: 2 }],
						[21, { c1: 3, c2: 4 }],
					]);
				},

				getColumnNames: function () {
					return columnNames;
				},
			},
		});

		expect(dataFrame.getColumnNames()).to.eql(columnNames);
		expect(dataFrame.toPairs()).to.eql([
			[20, { c1: 1, c2: 2 }],
			[21, { c1: 3, c2: 4 }],
		]);
	});

	it('can create from rows iterable', function () {
		
		var columnNames = ["c1", "c2"];
		var dataFrame = new DataFrame({
			columnNames: columnNames,
			values: function () {
				return new ArrayIterator([
					[1, 2],
					[3, 4],
				]);
			},
		});

		expect(dataFrame.getColumnNames()).to.eql(columnNames);
		expect(dataFrame.toPairs()).to.eql([
			[0, { c1: 1, c2: 2 }],
			[1, { c1: 3, c2: 4 }],
		]);

	});

	it('can create from rows iterable with index', function () {

		var columnNames = ["c1", "c2"];
		var dataFrame = new DataFrame({
			columnNames: columnNames,
			values: function () {
				return new ArrayIterator([
					[1, 2],
					[3, 4],
				]);
			},
			index: new Series({ values: [10, 11] })
		});

		expect(dataFrame.getColumnNames()).to.eql(columnNames);
		expect(dataFrame.toPairs()).to.eql([
			[10, { c1: 1, c2: 2 }],
			[11, { c1: 3, c2: 4 }],
		]);		
	});

	it('can create from objects iterable', function () {
		
		var dataFrame = new DataFrame({
			values: function () {
				return new ArrayIterator([
					{ c1: 1, c2: 2 },
					{ c1: 3, c2: 4 },
				]);
			},
		});

		var columnNames = ["c1", "c2"];
		expect(dataFrame.getColumnNames()).to.eql(columnNames);
		expect(dataFrame.toPairs()).to.eql([
			[0, { c1: 1, c2: 2 }],
			[1, { c1: 3, c2: 4 }],
		]);
	});

	it('can create from objects iterable with index', function () {
		
		var dataFrame = new DataFrame({
			values: function () {
				return new ArrayIterator([
					{ c1: 1, c2: 2 },
					{ c1: 3, c2: 4 },
				]);
			},
			index: new Series({ values: [10, 11] })
		});

		var columnNames = ["c1", "c2"];
		expect(dataFrame.getColumnNames()).to.eql(columnNames);
		expect(dataFrame.toPairs()).to.eql([
			[10, { c1: 1, c2: 2 }],
			[11, { c1: 3, c2: 4 }],
		]);
	});

	it("can handle undefined row", function () {
		var d = new DataFrame({
			columnNames: ["c1", "c2"],
			values: [
				[1, 2],
				undefined,
				[5, 2]
			],
		});

		expect(function () {
			d.toArray();

		}).to.throw();
	});

	it("test case that was broken due to missing comma", function () {
		var d = new DataFrame({
			columnNames: ["c1", "c2"],
			values: [
				[1, 2],
				[1, 3],
				[5, 2]  // Missing comma here was causing a problem. This entire row goes missing from the data frame.
				[1, 3], // This test verifies that the issue is handled gracefully.
				[5, 2]
			],
		});

		expect(function () {
			d.toArray();

		}).to.throw();
	});

	it('can create data frame from column arrays - index', function () {

		var df = new DataFrame({
			columns: {
				A: [1, 2, 3, 4],
				B: ['a', 'b', 'c', 'd'],
			},

			index: new Series({ values: [10, 20, 30, 40] }),
		});

		expect(df.toPairs()).to.eql([
			[10, { A: 1, B: 'a' }],
			[20, { A: 2, B: 'b' }],
			[30, { A: 3, B: 'c' }],
			[40, { A: 4, B: 'd' }],
		]);
	});

	it('can create data frame from column arrays - array', function () {

		var df = new DataFrame({
			columns: {
				A: [1, 2, 3, 4],
				B: ['a', 'b', 'c', 'd'],
			},

			index: [11, 12, 13, 14],
		});

		expect(df.toPairs()).to.eql([
			[11, { A: 1, B: 'a' }],
			[12, { A: 2, B: 'b' }],
			[13, { A: 3, B: 'c' }],
			[14, { A: 4, B: 'd' }],
		]);
	});

	it('can create dataframe from columns - with series', function () {

		var df = new DataFrame({
			columns: {
				A: new Series({ values: [1, 2, 3, 4] }),
				B: new Series({ values: ['a', 'b', 'c', 'd'] }),
			},
		});

		expect(df.toArray()).to.eql([
			{ A: 1, B: 'a' },
			{ A: 2, B: 'b' },
			{ A: 3, B: 'c' },
			{ A: 4, B: 'd' },
		]);
	});

	it('can create data frame from column arrays - default index', function () {

		var df = new DataFrame({
			columns: {
				A: [1, 2, 3, 4],
				B: ['a', 'b', 'c', 'd'],
			},
		});

		expect(df.toPairs()).to.eql([
			[0, { A: 1, B: 'a' }],
			[1, { A: 2, B: 'b' }],
			[2, { A: 3, B: 'c' }],
			[3, { A: 4, B: 'd' }],
		]);
	});

	it('duplicates columnes are renamed to be unique - rows', function () {

		var df = new DataFrame({
			columnNames: [
				"some-column",
				"some-Column",
			],
			values: [
				[1, 2],
				[3, 4],
			],
		});

		expect(df.getColumnNames()).to.eql(["some-column.1", "some-Column.2"]);
		expect(df.toArray()).to.eql([
			{
				"some-column.1": 1,
				"some-Column.2": 2,
			},
			{
				"some-column.1": 3,
				"some-Column.2": 4,
			},
		]);
	});

});