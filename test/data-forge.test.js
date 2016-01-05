'use strict';


describe('data-forge', function () {
	
	var dataForge = require('../index');	
	var ArrayIterator = require('../src/iterators/array');	

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
				return new ArrayIterator(values);
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
		expect(merged.toValues()).to.eql([
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
		expect(merged.toValues()).to.eql([
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

	it('can concat data frames', function () { //todo: also when columns are unevan or at different indices

	 	var df1 = initDataFrame(["1", "2"], [[1, 2], [3, 4]]);
	 	var df2 = initDataFrame(["1", "2"], [[5, 6], [7, 8]]);
	 	var df3 = initDataFrame(["1", "2"], [[9, 10], [11, 12]]);

	 	var result = dataForge.concat([df1, df2, df3]);

	 	expect(result.getColumnNames()).to.eql(["1", "2"]);
	 	expect(result.getIndex().toValues()).to.eql([0, 1, 0, 1, 0, 1]);
	 	expect(result.toValues()).to.eql([
 			[1, 2],
 			[3, 4],
 			[5, 6],
 			[7, 8],
 			[9, 10],
 			[11, 12]
 		]);
	});

	it('concat can handle out of order columns', function () {

	 	var df1 = initDataFrame(["1", "2"], [[1, 2], [3, 4]]);
	 	var df2 = initDataFrame(["2", "1"], [[6, 5], [8, 7]]);

	 	var result = dataForge.concat([df1, df2]);

	 	expect(result.getColumnNames()).to.eql(["1", "2"]);
	 	expect(result.getIndex().toValues()).to.eql([0, 1, 0, 1]);
	 	expect(result.toValues()).to.eql([
 			[1, 2],
 			[3, 4],
 			[5, 6],
 			[7, 8],
 		]);
	});

	it('concat can handle uneven columns', function () {

	 	var df1 = initDataFrame(["1", "2"], [[1, 2], [3, 4]]);
	 	var df2 = initDataFrame(["2", "3"], [[6, 5], [8, 7]]);

	 	var result = dataForge.concat([df1, df2]);

	 	expect(result.getColumnNames()).to.eql(["1", "2", "3"]);
	 	expect(result.getIndex().toValues()).to.eql([0, 1, 0, 1]);
	 	expect(result.toValues()).to.eql([
 			[1, 2, undefined],
 			[3, 4, undefined],
 			[undefined, 6, 5],
 			[undefined, 8, 7],
 		]);
	});

	it('can load from array of empty objects', function () {

		var jsData = "[{}, {}]";
		var dataFrame = dataForge.fromJSON(jsData);

		expect(dataFrame.getColumnNames().length).to.eql(0);
		expect(dataFrame.toValues()).to.eql([
			[],
			[],
		]);
	});

	it('error loading from empty json string', function () {

		var jsData = "";
		expect(function () {
				dataForge.fromJSON(jsData);
			}).to.throw();
	});

	it('can load from json with json array', function () {

		var jsData = "[]";
		var dataFrame = dataForge.fromJSON(jsData);

		expect(dataFrame.getColumnNames().length).to.eql(0);
		expect(dataFrame.toValues().length).to.eql(0);
	});

	it('can load from json array', function () {

		var jsData = 
			'[' +
				'{' +
					'"Column1": "A",' +
					'"Column2": 1' +
				'},' +
				'{' +
					'"Column1": "B",' +
					'"Column2": 2' +
				'}' +
			']';
		var dataFrame = dataForge.fromJSON(jsData);

		expect(dataFrame.getColumnNames()).to.eql(['Column1', 'Column2']);
		expect(dataFrame.toValues()).to.eql([
			['A', 1],
			['B', 2],
		]);
	});

	it('uneven columns loaded from json result in undefined values', function () {

		var jsData = 
			'[' +
				'{' +
					'"Column1": "A"' +
				'},' +
				'{' +
					'"Column2": 2' +
				'}' +
			']';
		var dataFrame = dataForge.fromJSON(jsData);

		expect(dataFrame.getColumnNames()).to.eql(['Column1', 'Column2']);
		expect(dataFrame.toValues()).to.eql([
			['A', undefined],
			[undefined, 2],
		]);
	});	

});
