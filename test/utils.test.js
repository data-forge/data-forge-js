'use strict';

describe('utils', function () {

	var expect = require('chai').expect;

	var utils = require('../src/utils');
	var dropElement = utils.dropElement;

	it('can drop first element of array', function () {

		expect(dropElement([0, 1, 2], 0)).to.eql([1, 2]);
	});

	it('can drop middle element of array', function () {

		expect(dropElement([0, 1, 2], 1)).to.eql([0, 2]);
	});

	it('can drop last element of array', function () {

		expect(dropElement([0, 1, 2], 2)).to.eql([0, 1]);
	});

	it('can handle empty array', function () {

		expect(dropElement([], 0)).to.eql([]);
	});

	it('can handle dropping out of range index', function () {

		expect(dropElement([0, 1, 2], 5)).to.eql([0, 1, 2]);
	});

	it('can handle dropping negative index', function () {

		expect(dropElement([0, 1, 2], -5)).to.eql([0, 1, 2]);
	});

});