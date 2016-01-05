'use strict';

describe('Index', function () {

	var LazyIndex = require('../src/lazyindex');
	var ArrayIterator = require('../src/iterators/array');

	var expect = require('chai').expect;

	it('can get values from index', function () {

		var index = new LazyIndex(
			"__test__",
			function () { 
				return new ArrayIterator([0, 1, 2, 3]); 
			}
		);
		expect(index.toValues()).to.eql([0, 1, 2, 3]);
	});

});