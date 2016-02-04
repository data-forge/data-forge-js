'use strict';

describe('index generator iterator', function () {

	var IndexGeneratorIterator = require('../src/iterators/index-generator');
	var expect = require('chai').expect;

	it('result is undefined before moving to first element', function () {

		var testObject = new IndexGeneratorIterator([1]);
		expect(testObject.getCurrent()).to.be.undefined;
	});

	it('can generate sequence', function () {

		var testObject = new IndexGeneratorIterator([]);

		expect(testObject.moveNext()).to.eql(true);
		expect(testObject.getCurrent()).to.eql(0);

		expect(testObject.moveNext()).to.eql(true);
		expect(testObject.getCurrent()).to.eql(1);

		expect(testObject.moveNext()).to.eql(true);
		expect(testObject.getCurrent()).to.eql(2);

		expect(testObject.moveNext()).to.eql(true);
		expect(testObject.getCurrent()).to.eql(3);

		expect(testObject.moveNext()).to.eql(true);
		expect(testObject.getCurrent()).to.eql(4);

		expect(testObject.moveNext()).to.eql(true);

	});

});