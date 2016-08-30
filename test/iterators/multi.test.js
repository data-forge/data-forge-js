'use strict';

describe('multi iterator', function () {

	var MultiIterator = require('../../src/iterators/multi');
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

	it('result is undefined before first element', function () {

		var testObject = new MultiIterator([makeArrayIterable([1,2]), makeArrayIterable([1,2])]);
		expect(testObject.getCurrent()).to.eql(undefined);
	});

	it('completes straight away when there are no child iterators', function () {

		var testObject = new MultiIterator([]);
		expect(testObject.moveNext()).to.eql(false);
	});

	it('can move multiple iterators forward when not at end', function () {

		var testObject = new MultiIterator([makeInfiniteIterable(), makeInfiniteIterable()]);
		expect(testObject.moveNext()).to.eql(true);
	});

	it('completes when first child iterator completes', function () {

		var testObject = new MultiIterator([makeEmptyIterable(), makeInfiniteIterable()]);
		expect(testObject.moveNext()).to.eql(false);
	});

	it('completes when second child iterator completes', function () {

		var testObject = new MultiIterator([makeInfiniteIterable(), makeEmptyIterable()]);
		expect(testObject.moveNext()).to.eql(false);
	});

	it('can extract current value', function () {

		var testObject = new MultiIterator([makeArrayIterable([1,2]), makeArrayIterable([10,20])]);
		expect(testObject.moveNext()).to.eql(true);
		expect(testObject.getCurrent()).to.eql([1, 10]);
		expect(testObject.moveNext()).to.eql(true);
		expect(testObject.getCurrent()).to.eql([2, 20]);
		expect(testObject.moveNext()).to.eql(false);
	});

	it('can always get last item at the end', function () {

		var testObject = new MultiIterator([makeArrayIterable([1,2]), makeArrayIterable([10,20])]);
		testObject.moveNext();
		testObject.moveNext();
		testObject.moveNext();

		expect(testObject.getCurrent()).to.eql([2, 20]);
	});

});