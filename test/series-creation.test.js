'use strict';

describe('series creation', function () {

	var expect = require('chai').expect;

	var Series = require('../src/series');
	var Index = require('../src/index');
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

	it('can create from values with index', function () {

		var series = new Series({
			values: [1, 2, 3],
			index: new Index([10, 11, 22]),
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
			iterable: function () {
				return new ArrayIterator([
					[10, 1],
					[11, 2],
					[22, 3],
				]);
			},
		});

		expect(series.toPairs()).to.eql([
			[10, 1],
			[11, 2],
			[22, 3],
		]);
	});

});