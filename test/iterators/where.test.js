'use strict';

describe('select iterator', function () {

	var WhereIterator = require('../../src/iterators/where');
	var ArrayIterator = require('../../src/iterators/array');
	var expect = require('chai').expect;

	it('can filter out elements', function () {

		var where = new WhereIterator(new ArrayIterator([1, 2, 3, 4]), function (value) {
				return value == 2 || value == 4;
			});

		expect(where.realize()).to.eql([2, 4]);
	});

});