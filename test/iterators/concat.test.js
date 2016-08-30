'use strict';

describe('concat iterator', function () {

	var ConcatIterator = require('../../src/iterators/concat');
	var ArrayIterator = require('../../src/iterators/array');
	var expect = require('chai').expect;

	var makeArrayIterable = function (arr) {
		return {
			getIterator: function () {
				return new ArrayIterator(arr);
			},
		};		
	};

	var makeEmptyIterable = function () {
		return {
			getIterator: function () {
				return {
					moveNext: function () {
						return false;
					},

					getCurrent: function () {
						return null;
					},					
				};
			},
		};
	};

	var makeInfiniteIterable = function () {
		return {
			getIterator: function () {
				return {
					moveNext: function () {
						return true;
					},

					getCurrent: function () {
						return null;
					},					
				};
			},
		};
	};	

	it('result is undefined before moving to first element', function () {

		var testObject = new ConcatIterator([]);
		expect(testObject.getCurrent()).to.be.undefined;
	});

	it('completes straight way when there are no child iterators', function () {

		var testObject = new ConcatIterator([]);
		expect(testObject.moveNext()).to.eql(false);
	});

	it('completes immediately if child iterators are empty', function () {

		var testObject = new ConcatIterator([makeEmptyIterable(), makeEmptyIterable()]);
		expect(testObject.moveNext()).to.eql(false);
	});

	it('completes when all child iterators complete', function () {

		var testObject = new ConcatIterator([makeArrayIterable([1, 2]), makeArrayIterable([3, 4])]);
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

		var testObject = new ConcatIterator([makeArrayIterable([1, 2]), makeArrayIterable([3, 4])]);
		testObject.moveNext();
		testObject.moveNext();
		testObject.moveNext();
		testObject.moveNext();
		testObject.moveNext();

		expect(testObject.getCurrent()).to.eql(4);
	});

});