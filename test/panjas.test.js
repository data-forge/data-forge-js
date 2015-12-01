'use strict';


describe('BaseDataFrame', function () {
	
	var dataForge = require('../index');	
	
	var expect = require('chai').expect;
	var assert = require('chai').assert;

	var initDataFrame = function (columns, values) {
		assert.isArray(columns);
		assert.isArray(values);

		return new dataForge.LazyDataFrame(
			function () {
				return columns;
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
			[
				['foo', 4],
				['foo', 5],
			]
		);

		var merged = dataForge.merge(left, right, 'key');
		expect(merged.getColumnNames()).to.eql([
			'key',
			'lval',
			'rval',
		]);
		expect(merged.getValues()).to.eql([
			['foo', 1, 4],
			['foo', 1, 5],
			['foo', 2, 4],
			['foo', 2, 5],
		]);
	});

	it('can merge on columns that have different indices', function () {

		var left = initDataFrame(
			[
				'lval',
				'key',
			],
			[
				[1, 'foo'],
				[2, 'foo'],
			]
		);
		var right = initDataFrame(
			[
				'key',
				'rval',
			],
			[
				['foo', 4],
				['foo', 5],
			]
		);

		var merged = dataForge.merge(left, right, 'key');
		expect(merged.getColumnNames()).to.eql([
			'key',
			'lval',
			'rval',
		]);
		expect(merged.getValues()).to.eql([
			['foo', 1, 4],
			['foo', 1, 5],
			['foo', 2, 4],
			['foo', 2, 5],
		]);
	});

	it('merging with column that doesnt exist in left data frame throws exception', function () {

		var left = initDataFrame(
			[
				'left-key',
				'lval',
			],
			[
				['foo', 1],
				['foo', 2],
			]
		);
		var right = initDataFrame(
			[
				'right-key',
				'rval',
			],
			[
				['foo', 4],
				['foo', 5],
			]
		);

		expect(function () {
			dataForge.merge(left, right, 'right-key');
		}).to.throw(Error);
	});

	it('merging with column that doesnt exist in right data frame throws exception', function () {

		var left = initDataFrame(
			[
				'left-key',
				'lval',
			],
			[
				['foo', 1],
				['foo', 2],
			]
		);
		var right = initDataFrame(
			[
				'right-key',
				'rval',
			],
			[
				['foo', 4],
				['foo', 5],
			]
		);

		expect(function () {
			dataForge.merge(left, right, 'left-key');
		}).to.throw(Error);
	});
});
