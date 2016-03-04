'use strict'; 

describe('empty iterator', function () {

	var expect = require('chai').expect;

	var EmptyIterator = require('../../src/iterators/empty');

	it('moveNext always returns false', function () {

		var testObject = new EmptyIterator();
		expect(testObject.moveNext()).to.eql(false);
		expect(testObject.moveNext()).to.eql(false);
		expect(testObject.moveNext()).to.eql(false);
		expect(testObject.moveNext()).to.eql(false);
	});

	it('getCurrent always returns undefined', function () {

		var testObject = new EmptyIterator();
		expect(testObject.getCurrent()).to.eql(undefined);
		expect(testObject.getCurrent()).to.eql(undefined);
		expect(testObject.getCurrent()).to.eql(undefined);
		expect(testObject.getCurrent()).to.eql(undefined);
	});

});