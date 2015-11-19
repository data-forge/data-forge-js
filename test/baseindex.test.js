'use strict';

describe('Index', function () {

	var Index = require('../src/index');

	var expect = require('chai').expect;

	it('can get values from index', function () {

		var index = new Index("__test__", [0, 1, 2, 3]);
		expect(index.getValues()).to.eql([0, 1, 2, 3]);
	});

	it('can skip', function () {

		var index = new Index("__test__", [0, 1, 2, 3]);
		expect(index.skip(2).getValues()).to.eql([2, 3]);
	});

	it('can take', function () {

		var index = new Index("__test__", [0, 1, 2, 3]);
		expect(index.take(2).getValues()).to.eql([0, 1]);
	});

	it('can get subset of rows', function () {

		var index = new Index("__test__", [0, 1, 2, 3]);
		var subset = index .getRowsSubset(1, 2);
		expect(subset.getValues()).to.eql([1, 2]);
	});
});