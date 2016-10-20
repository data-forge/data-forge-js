'use strict';

describe('series creation', function () {

	var expect = require('chai').expect;

	var Series = require('../src/series');
	var ArrayIterator = require('../src/iterators/array');

	it('can create from values', function () {

		var series = new Series({
			values: [1, 2, 3],
		});

		expect(series.toPairs()).to.eql([
			[0, 1],
			[1, 2],
			[2, 3],
		]);
	});

	it('can create from just an array', function () {

		var series = new Series([1, 2, 3]);

		expect(series.toPairs()).to.eql([
			[0, 1],
			[1, 2],
			[2, 3],
		]);
	});

	it('can create with values from iterable', function () {

		var series = new Series({
			values: {
				getIterator: function () {
					return new ArrayIterator([41, 42, 43]);
				},				
			},
		});

		expect(series.toPairs()).to.eql([
			[0, 41],
			[1, 42],
			[2, 43],
		]);
	});

	it('can create from values with index', function () {

		var series = new Series({
			values: [1, 2, 3],
			index: new Series({ values: [10, 11, 22] }),
		});

		expect(series.toPairs()).to.eql([
			[10, 1],
			[11, 2],
			[22, 3],
		]);
	});

	it('can create from values with array index', function () {

		var series = new Series({
			values: [1, 2, 3],
			index: [10, 11, 22],
		});

		expect(series.toPairs()).to.eql([
			[10, 1],
			[11, 2],
			[22, 3],
		]);
	});

	it('can create from index/value with iterable', function () {

		var series = new Series({
			iterable: {
				getIterator: function () {
					return new ArrayIterator([
						[10, 1],
						[11, 2],
						[22, 3],
					]);
				},
			},
		});

		expect(series.toPairs()).to.eql([
			[10, 1],
			[11, 2],
			[22, 3],
		]);
	});

	it('can create empty series', function () {

		var series = new Series();
		expect(series.count()).to.eql(0);
		expect(series.toArray()).to.eql([]);
	});

	it('can create empty series with empty config', function () {

		var series = new Series({});
		expect(series.count()).to.eql(0);
		expect(series.toArray()).to.eql([]);
	});
});