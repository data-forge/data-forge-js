'use strict';

describe('pair iterator', function () {

	var PairIterator = require('../../src/iterators/pair');
	var ArrayIterator = require('../../src/iterators/array');
	var expect = require('chai').expect;

	it('result is undefined before moving to first element', function () {

		var mockIterator1 = {
			moveNext: function () {
				return true;
			},

			getCurrent: function () {
				return null;
			},
		};

		var mockIterator2 = {
			moveNext: function () {
				return true;
			},

			getCurrent: function () {
				return null;
			},
		};

		var pair = new PairIterator(mockIterator1, mockIterator2);
		expect(pair.getCurrent()).to.be.undefined;
	});

	it('result is undefined after last element', function () {

		var mockIterator1 = {
			moveNext: function () {
				return false;
			},

			getCurrent: function () {
				return null;
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

		var pair = new PairIterator(mockIterator1, mockIterator2);
		expect(pair.getCurrent()).to.be.undefined;
	});

	it('can move iterators forward when not at end', function () {

		var mockIterator1 = {
			moveNext: function () {
				return true;
			},

			getCurrent: function () {
				return null;
			},
		};

		var mockIterator2 = {
			moveNext: function () {
				return true;
			},

			getCurrent: function () {
				return null;
			},
		};

		var pair = new PairIterator(mockIterator1, mockIterator2);
		expect(pair.moveNext()).to.eql(true);
	});

	it('completes when first child iterator completes', function () {

		var mockIterator1 = {
			moveNext: function () {
				return false;
			},

			getCurrent: function () {
				return null;
			},
		};

		var mockIterator2 = {
			moveNext: function () {
				return true;
			},

			getCurrent: function () {
				return null;
			},
		};

		var pair = new PairIterator(mockIterator1, mockIterator2);
		expect(pair.moveNext()).to.eql(false);
	});

	it('completes when second child iterator completes', function () {
		var mockIterator1 = {
			moveNext: function () {
				return true;
			},

			getCurrent: function () {
				return null;
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

		var pair = new PairIterator(mockIterator1, mockIterator2);
		expect(pair.moveNext()).to.eql(false);
	});

	it('can extract current value', function () {

		var pair = new PairIterator(new ArrayIterator([1, 2]), new ArrayIterator([10, 20]));
		expect(pair.moveNext()).to.eql(true);
		expect(pair.getCurrent()).to.eql([1, 10]);
		expect(pair.moveNext()).to.eql(true);
		expect(pair.getCurrent()).to.eql([2, 20]);
		expect(pair.moveNext()).to.eql(false);
	});

	it('can realise', function () {

		var pair = new PairIterator(new ArrayIterator([1, 2]), new ArrayIterator([10, 20]));
		expect(pair.realize()).to.eql([[1, 10], [2, 20]]);
	});

	it('can always get last item at the end', function () {

		var testObject = new PairIterator(new ArrayIterator([1, 2]), new ArrayIterator([10, 20]));

		testObject.moveNext();
		testObject.moveNext();
		testObject.moveNext();

		expect(testObject.getCurrent()).to.eql([2, 20]);
	});
});