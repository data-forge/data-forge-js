'use strict';

describe('Count iterator', function () {

	var CountIterator = require('../../src/iterators/count.js');

	var expect = require('chai').expect;

	it('can iterate count', function () {

		var testObject = new CountIterator();

		expect(testObject.moveNext()).to.eql(true);
		expect(testObject.getCurrent()).to.eql(0);
		expect(testObject.moveNext()).to.eql(true);
		expect(testObject.getCurrent()).to.eql(1);
		expect(testObject.moveNext()).to.eql(true);
		expect(testObject.getCurrent()).to.eql(2);
	});

});