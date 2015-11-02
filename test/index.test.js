'use strict';


describe('BaseDataFrame', function () {
	
	var panjas = require('../index');	
	
	var expect = require('chai').expect;
	var assert = require('chai').assert;

	var initDataFrame = function (columns, index, values) {
		assert.isArray(columns);
		assert.isObject(index);
		assert.isArray(values);

		return new panjas.LazyDataFrame(
			function () {
				return columns;
			},
			function () {
				return index;
			},
			function () {
				return values;
			}
		);
	};
	
	it('can merge on column', function () {

		var left = initDataFrame(
			[
				'key',
				'lval',
			],
			new panjas.NumberIndex([0, 1]),
			[
				['foo', 1],
				['foo', 2],
			]
		);
		var right = initDataFrame(
			[
				'key',
				'rval',
			],
			new panjas.NumberIndex([0, 1]),
			[
				['foo', 4],
				['foo', 5],
			]
		);

		var merged = panjas.merge(left, right, 'key');
		expect(merged.columns()).to.eql([
			'key',
			'lval',
			'rval',
		]);
		expect(merged.rows()).to.eql([
			[0, 'foo', 1, 4],
			[1, 'foo', 1, 5],
			[2, 'foo', 2, 4],
			[3, 'foo', 2, 5],
		]);
	});

});
