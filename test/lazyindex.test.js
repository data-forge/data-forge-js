'use strict';

describe('Index', function () {

	var LazyIndex = require('../src/lazyindex');

	var expect = require('chai').expect;

	it('can get values from index', function () {

		var index = new LazyIndex(
			"__test__",
			function () { 
				return [0, 1, 2, 3] 
			}
		);
		expect(index.getValues()).to.eql([0, 1, 2, 3]);
	});

});