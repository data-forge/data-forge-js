'use strict';

describe('Index', function () {

	var BaseIndex = require('../src/baseindex');
	var ArrayIterator = require('../src/iterators/array');
	var dataForge = require('../index');

	var expect = require('chai').expect;
	var assert = require('chai').assert;

	var initIndex = function (values) {
		assert.isArray(values);

		var baseIndex = new BaseIndex();
		
		baseIndex.getName = function () {
			return '==test-index==';
		};

		baseIndex.getIterator = function () {
			return new ArrayIterator(values);
		};
		
		return baseIndex;
	};

	it('can get values from index', function () {

		var index = initIndex([0, 1, 2, 3]);
		expect(index.toValues()).to.eql([0, 1, 2, 3]);
	});

	it('can skip', function () {

		var index = initIndex([0, 1, 2, 3]);
		expect(index.skip(2).toValues()).to.eql([2, 3]);
	});

	it('can take', function () {

		var index = initIndex([0, 1, 2, 3]);
		expect(index.take(2).toValues()).to.eql([0, 1]);
	});

	it('can get subset of rows', function () {

		var index = initIndex([0, 1, 2, 3]);
		var subset = index.getRowsSubset(1, 3);
		expect(subset.toValues()).to.eql([1, 2]);
	});

	it('can bake index', function () {

		var values = [10, 21, 32, 43];
		var index = initIndex(values);
		var baked = index.bake();

		expect(baked).not.to.equal(index);
		expect(baked).to.be.an.instanceOf(dataForge.Index);
		expect(baked.toValues()).to.eql(values);
	});
});