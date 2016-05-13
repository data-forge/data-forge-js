'use strict';

describe('take-while iterator', function () {

	var ArrayIterator = require('../../src/iterators/array');
	var TakeWhileIterator = require('../../src/iterators/take-while');
	var expect = require('chai').expect;

	it('result is undefined before moving to first element', function () {

		var testObject = new TakeWhileIterator(new ArrayIterator([1]), function () { return false; });
		expect(testObject.getCurrent()).to.be.undefined;
	});

	it('cannot move next for empty iterator with no take', function () {

		var testObject = new TakeWhileIterator(new ArrayIterator([]), function () { return true; });
		expect(testObject.moveNext()).to.eql(false);
	});

	it('cannot move next for empty iterator with take', function () {

		var testObject = new TakeWhileIterator(new ArrayIterator([]), function () { return false; });
		expect(testObject.moveNext()).to.eql(false);
	});

	it('can move next when iterator contains a single item and there is a take', function () {

		var testObject = new TakeWhileIterator(new ArrayIterator([1]), function () { return true; });
		expect(testObject.moveNext()).to.eql(true);
	});

	it('cannot move next if not taking anything', function () {

		var testObject = new TakeWhileIterator(new ArrayIterator([1]), function () { return false; });
		expect(testObject.moveNext()).to.eql(false);
	});

	it('can take based on values from child iterator', function () {

		var testObject = new TakeWhileIterator(new ArrayIterator([true, true, true, false, true]), function (value) { return value; });
		expect(testObject.moveNext()).to.eql(true);
		expect(testObject.moveNext()).to.eql(true);
		expect(testObject.moveNext()).to.eql(true);
		expect(testObject.moveNext()).to.eql(false);
	});

	it('can take a certain number of values', function () {

		var testObject = new TakeWhileIterator(new ArrayIterator([1, 2, 3, 4]), function (value) { return value < 3; });
		expect(testObject.moveNext()).to.eql(true);
		expect(testObject.getCurrent()).to.eql(1);

		expect(testObject.moveNext()).to.eql(true);
		expect(testObject.getCurrent()).to.eql(2);

		expect(testObject.moveNext()).to.eql(false);
	});

});