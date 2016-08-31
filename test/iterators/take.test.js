'use strict';

describe('take iterator', function () {

	var ArrayIterator = require('../../src/iterators/array');
	var TakeIterator = require('../../src/iterators/take');
	var expect = require('chai').expect;

	it('result is undefined before moving to first element', function () {

		var testObject = new TakeIterator(new ArrayIterator([1]), 1);
		expect(testObject.getCurrent()).to.be.undefined;
	});

	it('cannot move next for empty enumerator with no take', function () {

		var testObject = new TakeIterator(new ArrayIterator([]), 0);
		expect(testObject.moveNext()).to.eql(false);
	});

	it('cannot move next for empty enumerator with take', function () {

		var testObject = new TakeIterator(new ArrayIterator([]), 2);
		expect(testObject.moveNext()).to.eql(false);
	});

	it('can move when next take amount is more than the contents of the child iterator', function () {

		var testObject = new TakeIterator(new ArrayIterator([1]), 1);
		expect(testObject.moveNext()).to.eql(true);
	});

	it('cannot move next when take is 0', function () {

		var testObject = new TakeIterator(new ArrayIterator([1]), 0);
		expect(testObject.moveNext()).to.eql(false);
	});

	it('can get current value.', function () {

		var testObject = new TakeIterator(new ArrayIterator([1, 2, 3, 4, 5]), 3);
		expect(testObject.moveNext()).to.eql(true);
		expect(testObject.getCurrent()).to.eql(1);

		expect(testObject.moveNext()).to.eql(true);
		expect(testObject.getCurrent()).to.eql(2);

		expect(testObject.moveNext()).to.eql(true);
		expect(testObject.getCurrent()).to.eql(3);

		expect(testObject.moveNext()).to.eql(false);
	});

	it('can always get last item at the end', function () {

		var testObject = new TakeIterator(new ArrayIterator([1, 2, 3, 4, 5]), 2);

		testObject.moveNext();
		testObject.moveNext();
		testObject.moveNext();

		expect(testObject.getCurrent()).to.eql(2);
	});

});