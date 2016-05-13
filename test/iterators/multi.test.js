'use strict';

describe('multi iterator', function () {

	var MultiIterator = require('../../src/iterators/multi');
	var ArrayIterator = require('../../src/iterators/array');
	var expect = require('chai').expect;

	it('result is undefined before first element', function () {

		var multi = new MultiIterator([
			new ArrayIterator([1,2]), 
			new ArrayIterator([1,2])
		]);
		expect(multi.getCurrent()).to.eql(undefined);
	});

	it('completes straight away when there are no child iterators', function () {

		var multi = new MultiIterator([]);
		expect(multi.moveNext()).to.eql(false);
	});

	it('can move multiple iterators forward when not at end', function () {

		var mockIterator = {
			moveNext: function () {
				return true;
			},

			getCurrent: function () {
				return null;
			},
		};

		var multi = new MultiIterator([mockIterator, mockIterator]);
		expect(multi.moveNext()).to.eql(true);
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

		var multi = new MultiIterator([mockIterator1, mockIterator2]);
		expect(multi.moveNext()).to.eql(false);
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

		var multi = new MultiIterator([mockIterator1, mockIterator2]);
		expect(multi.moveNext()).to.eql(false);
	});

	it('can extract current value', function () {

		var multi = new MultiIterator([new ArrayIterator([1, 2]), new ArrayIterator([10, 20])]);
		expect(multi.moveNext()).to.eql(true);
		expect(multi.getCurrent()).to.eql([1, 10]);
		expect(multi.moveNext()).to.eql(true);
		expect(multi.getCurrent()).to.eql([2, 20]);
		expect(multi.moveNext()).to.eql(false);
	});

	it('can realise', function () {

		var multi = new MultiIterator([new ArrayIterator([1, 2]), new ArrayIterator([10, 20])]);
		expect(multi.realize()).to.eql([[1, 10], [2, 20]]);
	});

	it('can always get last item at the end', function () {

		var multi = new MultiIterator([new ArrayIterator([1, 2]), new ArrayIterator([10, 20])]);

		multi.moveNext();
		multi.moveNext();
		multi.moveNext();

		expect(multi.getCurrent()).to.eql([2, 20]);
	});

});