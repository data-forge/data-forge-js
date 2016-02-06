'use strict';

describe('Index', function () {

	var Index = require('../src/index');
	var ArrayIterator = require('../src/iterators/array');
	var dataForge = require('../index');
	var moment = require('moment');

	var expect = require('chai').expect;
	var assert = require('chai').assert;

	var initIndex = function (values) {
		assert.isArray(values);

		return new Index(values);
	};

	it('can get values from index', function () {

		var index = new Index([0, 1, 2, 3]);
		expect(index.toValues()).to.eql([0, 1, 2, 3]);
	});

	it('can specify values from iterable', function () {

		var iterable = function () {
			return new ArrayIterator([0, 1, 2, 3]);
		};
		var index = new Index(iterable);
		expect(index.toValues()).to.eql([0, 1, 2, 3]);
	});

	it('can get values from index', function () {

		var index = initIndex([0, 1, 2, 3]);
		expect(index.toValues()).to.eql([0, 1, 2, 3]);
	});

	it('can skip', function () {

		var index = initIndex([0, 1, 2, 3]);
		expect(index.skip(2).toValues()).to.eql([2, 3]);
	});

	it('can take', function () {

		var index = initIndex([0, 1, 2, 3]);
		expect(index.take(2).toValues()).to.eql([0, 1]);
	});

	it('can get slice of rows', function () {

		var index = initIndex([0, 1, 2, 3]);
		var slice = index.slice(1, 3);
		expect(slice.toValues()).to.eql([1, 2]);
	});

	it('can get slice of rows with explicit predicates', function () {

		var index = initIndex([0, 1, 2, 3]);
		var slice = index.slice(
			function (value) {
				return value < 1;
			},
			function (value) {
				return value < 3;
			}
		);
		expect(slice.toValues()).to.eql([1, 2]);
	});

	it('can get slice of rows from time series', function () {

		var index = initIndex([new Date(2016, 1, 1), new Date(2016, 1, 3), new Date(2016, 1, 5), new Date(2016, 1, 10)]);
		var slice = index.slice(new Date(2016, 1, 2), new Date(2016, 1, 8),
			function (a, b) {
				return moment(a).isBefore(b);
			}
		);
		expect(slice.toValues()).to.eql([new Date(2016, 1, 3), new Date(2016, 1, 5)]);
	});

	it('can bake index', function () {

		var values = [10, 21, 32, 43];
		var index = initIndex(values);
		var baked = index.bake();

		expect(baked).not.to.equal(index);
		expect(baked).to.be.an.instanceOf(dataForge.Index);
		expect(baked.toValues()).to.eql(values);
	});

	it('can get size', function () {

		var values = [10, 21, 32, 43];
		var index = initIndex(values);
		expect(index.count()).to.eql(values.length);
	});

	it('getting first row of empty index throws exception', function () {

		var index = initIndex([]);

		expect(function () {
			index.first();
		}).to.throw();
	});

	it('getting last row of empty index throws exception', function () {

		var index = initIndex([]);

		expect(function () {
			index.last();
		}).to.throw();
	});

	it('can get first and last rows', function () {

		var index = initIndex([1, 2, 3]);

		expect(index.first()).to.eql(1);
		expect(index.last()).to.eql(3);
	});

	it('can reverse', function () {

		var index = initIndex([1, 2, 3]);
		var reversed = index.reverse();
		expect(index.toValues()).to.eql([1, 2, 3]);
		expect(reversed.toValues()).to.eql([3, 2, 1]);
	});

	it('can get head of index', function () {

		var index = initIndex([1, 2, 3]);
		var head = index.head(2);
		expect(head.toValues()).to.eql([1, 2]);
	});

	it('can get tail of index', function () {

		var index = initIndex([1, 2, 3]);
		var head = index.tail(2);
		expect(head.toValues()).to.eql([2, 3]);
	});
});