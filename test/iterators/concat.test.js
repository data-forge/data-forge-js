'use strict';

describe('concat iterator', function () {

	var ConcatIterator = require('../../src/iterators/concat');
	var ArrayIterator = require('../../src/iterators/array');
	var expect = require('chai').expect;

	it('result is undefined before moving to first element', function () {

		var testObject = new ConcatIterator([]);
		expect(testObject.getCurrent()).to.be.undefined;
	});

	it('completes straight way when there are no child iterators', function () {

		var testObject = new ConcatIterator([]);
		expect(testObject.moveNext()).to.eql(false);
	});

	it('completes immediately if child iterators are empty', function () {

		var mockIterator1 = {
			moveNext: function () {
				return false;
			},

			getCurrent: function () {
				return null;
			},
		};

		var mockIterable1 = {
			getIterator: function () {
				return mockIterator1;
			},			
		};

		var mockIterator2 = {
			moveNext: function () {
				return false;
			},

			getCurrent: function () {
				return null;
			},
		};

		var mockIterable2 = {
			getIterator: function () {
				return mockIterator2;
			},			
		};

		var testObject = new ConcatIterator([mockIterable1, mockIterable2]);
		expect(testObject.moveNext()).to.eql(false);
	});

	it('completes when all child iterators complete', function () {

		var iterator1 = new ArrayIterator([1, 2]);
		var iterable1 = {
			getIterator: function () {
				return iterator1;
			},
		};
		var iterator2 = new ArrayIterator([3, 4]);
		var iterable2 = {
			getIterator: function () {
				return iterator2;
			},
		};

		var testObject = new ConcatIterator([iterable1, iterable2]);
		expect(testObject.moveNext()).to.eql(true);
		expect(testObject.getCurrent()).to.eql(1);

		expect(testObject.moveNext()).to.eql(true);
		expect(testObject.getCurrent()).to.eql(2);

		expect(testObject.moveNext()).to.eql(true);
		expect(testObject.getCurrent()).to.eql(3);

		expect(testObject.moveNext()).to.eql(true);
		expect(testObject.getCurrent()).to.eql(4);

		expect(testObject.moveNext()).to.eql(false);
	});

	it('can always get last item at the end', function () {

		var iterator1 = new ArrayIterator([1, 2]);
		var iterable1 = {
			getIterator: function () {
				return iterator1;
			},
		};
		var iterator2 = new ArrayIterator([3, 4]);
		var iterable2 = {
			getIterator: function () {
				return iterator2;
			},
		};

		var testObject = new ConcatIterator([iterable1, iterable2]);

		testObject.moveNext();
		testObject.moveNext();
		testObject.moveNext();
		testObject.moveNext();
		testObject.moveNext();

		expect(testObject.getCurrent()).to.eql(4);
	});

});