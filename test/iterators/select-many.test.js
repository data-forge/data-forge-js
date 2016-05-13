'use strict';

describe('select-many iterator', function () {

	var SelectManyIterator = require('../../src/iterators/select-many');
	var ArrayIterator = require('../../src/iterators/array');
	var expect = require('chai').expect;

	it('can expand collection', function () {

		var selectMany = new SelectManyIterator(new ArrayIterator([1, 2, 3]), function (value) {
				return [value, value];
			});

		expect(selectMany.realize()).to.eql([1, 1, 2, 2, 3, 3]);
	});

	it('can return iterator', function () {

		var selectMany = new SelectManyIterator(new ArrayIterator([1, 2, 3]), function (value) {
				return new ArrayIterator([value, value]);
			});

		expect(selectMany.realize()).to.eql([1, 1, 2, 2, 3, 3]);
	});

	it('can cull elements', function () {

		var selectMany = new SelectManyIterator(new ArrayIterator([1, 2, 3]), function (value) {
				return [];
			});

		expect(selectMany.realize()).to.eql([]);
	});

	it('can always get last item at the end', function () {

		var testObject = new SelectManyIterator(new ArrayIterator([1, 2]), function (value) {
				return new ArrayIterator([value, value]);
			});

		testObject.moveNext();
		testObject.moveNext();
		testObject.moveNext();
		testObject.moveNext();
		testObject.moveNext();

		expect(testObject.getCurrent()).to.eql(2);
	});
});