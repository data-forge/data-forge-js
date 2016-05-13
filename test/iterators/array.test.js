'use strict';

describe('array iterator', function () {

	var ArrayIterator = require('../../src/iterators/array');
	var expect = require('chai').expect;

	it('result is undefined before moving to first element', function () {

		var testObject = new ArrayIterator([1]);
		expect(testObject.getCurrent()).to.be.undefined;
	});

	it('cannot move next for empty enumerator', function () {

		var testObject = new ArrayIterator([]);
		expect(testObject.moveNext()).to.eql(false);

	});

	it('can move next when enumerator contains a single item', function () {

		var testObject = new ArrayIterator([1]);
		expect(testObject.moveNext()).to.eql(true);
	});

	it('move next returns false at end', function () {

		var testObject = new ArrayIterator([1]);
		testObject.moveNext();
		expect(testObject.moveNext()).to.eql(false);
	});

	it('can extract current value', function () {

		var testObject = new ArrayIterator([1]);
		testObject.moveNext();
		expect(testObject.getCurrent()).to.eql(1);
	});

	it('can realize iterator', function () {

		var values = [1, 2, 3];
		var testObject = new ArrayIterator(values);
		expect(testObject.realize()).to.eql(values);
	})

	it('can always get last item at the end', function () {

		var testObject = new ArrayIterator([1, 2]);

		testObject.moveNext();
		testObject.moveNext();
		testObject.moveNext();

		expect(testObject.getCurrent()).to.eql(2);
	});

});