'use strict';

describe('pair iterator', function () {

	var PairIterator = require('../../src/iterators/pair');
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

		var pair = new PairIterator(makeInfiniteIterable(), makeInfiniteIterable());
		expect(pair.getCurrent()).to.be.undefined;
	});

	it('result is undefined after last element', function () {

		var pair = new PairIterator(makeEmptyIterable(), makeEmptyIterable());
		expect(pair.getCurrent()).to.be.undefined;
	});

	it('can move iterators forward when not at end', function () {

		var pair = new PairIterator(makeInfiniteIterable(), makeInfiniteIterable());
		expect(pair.moveNext()).to.eql(true);
	});

	it('completes when first child iterator completes', function () {

		var pair = new PairIterator(makeEmptyIterable(), makeInfiniteIterable());
		expect(pair.moveNext()).to.eql(false);
	});

	it('completes when second child iterator completes', function () {

		var pair = new PairIterator(makeInfiniteIterable(), makeEmptyIterable());
		expect(pair.moveNext()).to.eql(false);
	});

	it('can extract current value', function () {

		var pair = new PairIterator(makeArrayIterable([1, 2]), makeArrayIterable([10, 20]));
		expect(pair.moveNext()).to.eql(true);
		expect(pair.getCurrent()).to.eql([1, 10]);
		expect(pair.moveNext()).to.eql(true);
		expect(pair.getCurrent()).to.eql([2, 20]);
		expect(pair.moveNext()).to.eql(false);
	});

	it('can realise', function () {

		var pair = new PairIterator(makeArrayIterable([1, 2]), makeArrayIterable([10, 20]));
		expect(pair.realize()).to.eql([[1, 10], [2, 20]]);
	});

	it('can always get last item at the end', function () {

		var testObject = new PairIterator(makeArrayIterable([1, 2]), makeArrayIterable([10, 20]));
		testObject.moveNext();
		testObject.moveNext();
		testObject.moveNext();

		expect(testObject.getCurrent()).to.eql([2, 20]);
	});
});