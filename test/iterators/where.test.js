'use strict';

describe('where iterator', function () {

	var WhereIterator = require('../../src/iterators/where');
	var ArrayIterator = require('../../src/iterators/array');
	var expect = require('chai').expect;

	it('can filter out elements', function () {

		var where = new WhereIterator(new ArrayIterator([1, 2, 3, 4]), function (value) {
				return value == 2 || value == 4;
			});

		expect(where.realize()).to.eql([2, 4]);
	});

	it('can always get last item at the end', function () {

		var testObject = new WhereIterator(new ArrayIterator([1, 2, 3, 4]), function (value) {
				return value == 2 || value == 4;
			});

		testObject.moveNext();
		testObject.moveNext();
		testObject.moveNext();

		expect(testObject.getCurrent()).to.eql(4);
	});

});