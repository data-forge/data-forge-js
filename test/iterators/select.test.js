'use strict';

describe('select iterator', function () {

	var SelectIterator = require('../../src/iterators/select');
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

	var makeInfiniteIterable = function (value) {
		return {
			getIterator: function () {
				return {
					moveNext: function () {
						return true;
					},

					getCurrent: function () {
						return value;
					},					
				};
			},
		};
	};	

	it('result is undefined before moving to first element', function () {

		var select = new SelectIterator(makeEmptyIterable(), function () {});
		expect(select.getCurrent()).to.be.undefined;
	});

	it('completes straight way when there are no child iterators', function () {

		var select = new SelectIterator(makeEmptyIterable(), function () {});
		expect(select.moveNext()).to.eql(false);
	});

	it('completes when child iterator is complete', function () {

		var select = new SelectIterator(makeEmptyIterable(), function () {});
		expect(select.moveNext()).to.eql(false);
	});

	it('continues while child iterator is not complete', function () {

		var select = new SelectIterator(makeInfiniteIterable(), function () {});
		expect(select.moveNext()).to.eql(true);
		expect(select.moveNext()).to.eql(true);
		expect(select.moveNext()).to.eql(true);
	});

	it('output is transformed by selector', function () {

		var original = { something: 1 };
		var transformed = { somethingElse: 2 };

		var select = new SelectIterator(makeInfiniteIterable(original), function (input) {
				expect(input).to.equal(original);

				return transformed;
			});
		
		select.moveNext();
		expect(select.getCurrent()).to.equal(transformed);
	});

	it('can realize', function () {

		var select = new SelectIterator(makeArrayIterable([1, 2]), 
				function (value) {
					return value + 1;
				}
			);
		expect(select.realize()).to.eql([2, 3]);
	});

	it('can always get last item at the end', function () {

		var testObject = new SelectIterator(makeArrayIterable([1, 2]), 
				function (value) {
					return value + 1;
				}
			);

		testObject.moveNext();
		testObject.moveNext();
		testObject.moveNext();

		expect(testObject.getCurrent()).to.eql(3);
	});

});