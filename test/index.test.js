'use strict';

describe('Index', function () {

	var Index = require('../src/index');

	var expect = require('chai').expect;

	it('can get values from index', function () {

		var index = new Index("__test__", [0, 1, 2, 3]);
		expect(index.getValues()).to.eql([0, 1, 2, 3]);
	});

});