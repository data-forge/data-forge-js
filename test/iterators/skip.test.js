'use strict';

describe('skip iterator', function () {

	var ArrayIterator = require('../../src/iterators/array');
	var SkipIterator = require('../../src/iterators/skip');
	var expect = require('chai').expect;

	it('result is undefined before moving to first element', function () {

		var testObject = new SkipIterator(new ArrayIterator([1]), 1);
		expect(testObject.getCurrent()).to.be.undefined;
	});

	it('cannot move next for empty enumerator with no skip', function () {

		var testObject = new SkipIterator(new ArrayIterator([]), 0);
		expect(testObject.moveNext()).to.eql(false);
	});

	it('cannot move next for empty enumerator with skip', function () {

		var testObject = new SkipIterator(new ArrayIterator([]), 2);
		expect(testObject.moveNext()).to.eql(false);
	});

	it('can move next when enumerator contains a single item and there is no skip', function () {

		var testObject = new SkipIterator(new ArrayIterator([1]), 0);
		expect(testObject.moveNext()).to.eql(true);
	});

	it('cannot move next if the skip amount is larger than the items.', function () {

		var testObject = new SkipIterator(new ArrayIterator([1]), 3);
		expect(testObject.moveNext()).to.eql(false);
	});

	it('can move next if the skip amount is less than the items.', function () {

		var testObject = new SkipIterator(new ArrayIterator([1, 2, 3, 4]), 3);
		expect(testObject.moveNext()).to.eql(true);
	});

	it('cannot move next after skipping items then completing the underlying iterator.', function () {

		var testObject = new SkipIterator(new ArrayIterator([1, 2, 3, 4]), 3);
		expect(testObject.moveNext()).to.eql(true);
		expect(testObject.moveNext()).to.eql(false);
	});

	it('can get current value.', function () {

		var testObject = new SkipIterator(new ArrayIterator([1, 2, 3, 4, 5]), 3);
		expect(testObject.moveNext()).to.eql(true);
		expect(testObject.getCurrent()).to.eql(4);

		expect(testObject.moveNext()).to.eql(true);
		expect(testObject.getCurrent()).to.eql(5);

		expect(testObject.moveNext()).to.eql(false);
	});

	it('can always get last item at the end', function () {

		var testObject = new SkipIterator(new ArrayIterator([1, 2, 3, 4, 5]), 3);

		testObject.moveNext();
		testObject.moveNext();
		testObject.moveNext();

		expect(testObject.getCurrent()).to.eql(5);
	});

});