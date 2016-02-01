'use strict';

describe('Index', function () {

	var Index = require('../src/index');
	var ArrayIterable = require('../src/iterables/array');

	var expect = require('chai').expect;

	it('can get values from index', function () {

		var index = new Index([0, 1, 2, 3]);
		expect(index.toValues()).to.eql([0, 1, 2, 3]);
	});

	it('can specify values from iterable', function () {

		var iterable = new ArrayIterable([0, 1, 2, 3]);
		var index = new Index(iterable);
		expect(index.toValues()).to.eql([0, 1, 2, 3]);
	});
});