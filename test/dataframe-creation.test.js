'use strict';

describe('dataframe creation', function () {

	var expect = require('chai').expect;

	var DataFrame = require('../src/dataframe');
	var Index = require('../src/index');
	var ArrayIterator = require('../src/iterators/array');

	it('can create from rows', function () {

		var columnNames = ["c1", "c2"];
		var dataFrame = new DataFrame({
			columnNames: columnNames,
			rows: [
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

	it('can specify column names with function', function () {

		var columnNames = ["c1", "c2"];
		var dataFrame = new DataFrame({
			columnNames: function () {
				return columnNames;
			},
			rows: [
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
			rows: [
				[1, 2],
				[3, 4],
			],
			index: new Index([10, 11]),
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
			rows: [
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
			rows: [
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

	it('can create from objects with index', function () {
		
		var dataFrame = new DataFrame({
			rows: [
				{ c1: 1, c2: 2 },
				{ c1: 3, c2: 4 },
			],
			index: new Index([10, 11]),
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
			rows: [
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
		
		var dataFrame = new DataFrame({
			iterable: function () {
				return new ArrayIterator([
					[20, { c1: 1, c2: 2 }],
					[21, { c1: 3, c2: 4 }],
				]);
			},
		});

		var columnNames = ["c1", "c2"];
		expect(dataFrame.getColumnNames()).to.eql(columnNames);
		expect(dataFrame.toPairs()).to.eql([
			[20, { c1: 1, c2: 2 }],
			[21, { c1: 3, c2: 4 }],
		]);
	});

	it('can create from index/value iterable with specified column order', function () {
		
		var columnNames = ["c2", "c1"];
		var dataFrame = new DataFrame({
			columnNames: columnNames,
			iterable: function () {
				return new ArrayIterator([
					[20, { c1: 1, c2: 2 }],
					[21, { c1: 3, c2: 4 }],
				]);
			},
		});

		expect(dataFrame.getColumnNames()).to.eql(columnNames);
		expect(dataFrame.toPairs()).to.eql([
			[20, { c1: 1, c2: 2 }],
			[21, { c1: 3, c2: 4 }],
		]);
	});

	it('can create from index/value iterable with column order from function', function () {
		
		var columnNames = ["c2", "c1"];
		var dataFrame = new DataFrame({
			columnNames: function () {
				return columnNames;
			},
			iterable: function () {
				return new ArrayIterator([
					[20, { c1: 1, c2: 2 }],
					[21, { c1: 3, c2: 4 }],
				]);
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
			rows: function () {
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
			rows: function () {
				return new ArrayIterator([
					[1, 2],
					[3, 4],
				]);
			},
			index: new Index([10, 11])
		});

		expect(dataFrame.getColumnNames()).to.eql(columnNames);
		expect(dataFrame.toPairs()).to.eql([
			[10, { c1: 1, c2: 2 }],
			[11, { c1: 3, c2: 4 }],
		]);		
	});

	it('can create from objects iterable', function () {
		
		var dataFrame = new DataFrame({
			rows: function () {
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
			rows: function () {
				return new ArrayIterator([
					{ c1: 1, c2: 2 },
					{ c1: 3, c2: 4 },
				]);
			},
			index: new Index([10, 11])
		});

		var columnNames = ["c1", "c2"];
		expect(dataFrame.getColumnNames()).to.eql(columnNames);
		expect(dataFrame.toPairs()).to.eql([
			[10, { c1: 1, c2: 2 }],
			[11, { c1: 3, c2: 4 }],
		]);
	});
});