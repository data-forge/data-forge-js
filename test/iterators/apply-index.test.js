'use strict';

describe('apply-index iterator', function () {

	var ApplyIndexIterator = require('../../src/iterators/apply-index');
	var ArrayIterator = require('../../src/iterators/array');
	var expect = require('chai').expect;

	it('can merge an index', function () {

		var applyIndex = new ApplyIndexIterator(new ArrayIterator([5, 4, 6]), new ArrayIterator([100, 200, 300]));

		expect(applyIndex.toPairs()).to.eql([
			[100, 5],
			[200, 4],
			[300, 6],
		]);
	});
});