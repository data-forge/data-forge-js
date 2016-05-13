'use strict';

describe('skip-while iterator', function () {

	var ArrayIterator = require('../../src/iterators/array');
	var SkipWhileIterator = require('../../src/iterators/skip-while');
	var expect = require('chai').expect;

	it('result is undefined before moving to first element', function () {

		var testObject = new SkipWhileIterator(new ArrayIterator([1]), function () { return false; });
		expect(testObject.getCurrent()).to.be.undefined;
	});

	it('cannot move next for empty iterator with no skip', function () {

		var testObject = new SkipWhileIterator(new ArrayIterator([]), function () { return false; });
		expect(testObject.moveNext()).to.eql(false);
	});

	it('cannot move next for empty iterator with skip', function () {

		var testObject = new SkipWhileIterator(new ArrayIterator([]), function () { return true; });
		expect(testObject.moveNext()).to.eql(false);
	});

	it('can move next when iterator contains a single item and there is no skip', function () {

		var testObject = new SkipWhileIterator(new ArrayIterator([1]), function () { return false; });
		expect(testObject.moveNext()).to.eql(true);
	});

	it('cannot move next if skipping everything', function () {

		var testObject = new SkipWhileIterator(new ArrayIterator([1]), function () { return true; });
		expect(testObject.moveNext()).to.eql(false);
	});

	it('can skip based on values from child iterator', function () {

		var testObject = new SkipWhileIterator(new ArrayIterator([true, true, false, true]), function (value) { return value; });
		expect(testObject.moveNext()).to.eql(true);
		expect(testObject.moveNext()).to.eql(true);
		expect(testObject.moveNext()).to.eql(false);
	});

	it('can skip a certain number of values', function () {

		var testObject = new SkipWhileIterator(new ArrayIterator([1, 2, 3, 4]), function (value) { return value < 3; });
		expect(testObject.moveNext()).to.eql(true);
		expect(testObject.getCurrent()).to.eql(3);

		expect(testObject.moveNext()).to.eql(true);
		expect(testObject.getCurrent()).to.eql(4);

		expect(testObject.moveNext()).to.eql(false);
	});

	it('can always get last item at the end', function () {

		var testObject = new SkipWhileIterator(new ArrayIterator([1, 2, 3, 4]), function (value) { return value < 3; });

		testObject.moveNext();
		testObject.moveNext();
		testObject.moveNext();

		expect(testObject.getCurrent()).to.eql(4);
	});

});