'use strict';

describe('concat iterator', function () {

	var ConcatIterator = require('../src/iterators/concat');
	var ArrayIterator = require('../src/iterators/array');
	var expect = require('chai').expect;

	it('result is undefined before moving to first element', function () {

		var concat = new ConcatIterator([]);
		expect(concat.getCurrent()).to.be.undefined;
	});

	it('completes straight way when there are no child iterators', function () {

		var concat = new ConcatIterator([]);
		expect(concat.moveNext()).to.eql(false);
	});

	it('completes immediately if child iterators are empty', function () {

		var mockIterable1 = {
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

		var mockIterable2 = {
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

		var concat = new ConcatIterator([mockIterable1, mockIterable2]);
		expect(concat.moveNext()).to.eql(false);
	});

	it('completes when all child iterators complete', function () {

		var mockIterable1 = {
			getIterator: function () {
				return new ArrayIterator([1, 2]);
			},
		};

		var mockIterable2 = {
			getIterator: function () {
				return new ArrayIterator([3, 4]);
			},
		};

		var concat = new ConcatIterator([mockIterable1, mockIterable2]);
		expect(concat.moveNext()).to.eql(true);
		expect(concat.getCurrent()).to.eql(1);

		expect(concat.moveNext()).to.eql(true);
		expect(concat.getCurrent()).to.eql(2);

		expect(concat.moveNext()).to.eql(true);
		expect(concat.getCurrent()).to.eql(3);

		expect(concat.moveNext()).to.eql(true);
		expect(concat.getCurrent()).to.eql(4);

		expect(concat.moveNext()).to.eql(false);
	});

});