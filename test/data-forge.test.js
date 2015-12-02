'use strict';


describe('data-forge', function () {
	
	var dataForge = require('../index');	
	
	var expect = require('chai').expect;
	var assert = require('chai').assert;
	var Q = require('q');

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

	it('can load data async', function () {

		var someTestData = 'some-test-data';
		var promise = Q(someTestData);
		var mockDataFrame = {};

		var mockDataSource = {
			read: function () {
				return promise;
			}
		};

		var mockDataFormat = {
			from: function (data) {
				expect(data).to.eql(someTestData);
				return mockDataFrame;
			}
		};

		return dataForge
			.from(mockDataSource)
			.as(mockDataFormat)
			.then(function (dataFrame) {
				expect(dataFrame).to.eql(mockDataFrame);
			});
	});

	it('can load data sync', function () {

		var someTestData = 'some-test-data';
		var mockDataFrame = {};

		var mockDataSource = {
			readSync: function () {
				return someTestData;
			}
		};

		var mockDataFormat = {
			from: function (data) {
				expect(data).to.eql(someTestData);
				return mockDataFrame;
			}
		};

		var dataFrame = dataForge
			.fromSync(mockDataSource)
			.as(mockDataFormat);

		expect(dataFrame).to.eql(mockDataFrame);
	});
	
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
