'use strict';


describe('data-forge', function () {
	
	var dataForge = require('../index');	
	var ArrayIterator = require('../src/iterators/array');	
	var E = require('linq');
	var extend = require('extend');

	var expect = require('chai').expect;
	var assert = require('chai').assert;

	var initDataFrame = function (columns, values) {
		assert.isArray(columns);
		assert.isArray(values);

		return new dataForge.DataFrame({
			columnNames: columns,
			rows: function () {
				return new ArrayIterator(values);
			},
		});
	};

	it('can merge on column', function () {

		var left = initDataFrame(
			[
				'merge-key',
				'left-val',
			],
			[
				['foo', 1],
				['foo', 2],
			]
		);
		var right = initDataFrame(
			[
				'merge-key',
				'right-val',
				'other-right-value'
			],
			[
				['foo', 4, 100],
				['foo', 5, 200],
			]
		);

		var merged = dataForge.merge(left, right, 'merge-key');
		expect(merged.getColumnNames()).to.eql([
			'merge-key',
			'left-val',
			'right-val',
			'other-right-value',
		]);
		expect(merged.toValues()).to.eql([
			['foo', 1, 4, 100],
			['foo', 1, 5, 200],
			['foo', 2, 4, 100],
			['foo', 2, 5, 200],
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
	 	expect(result.toPairs()).to.eql([
 			[0, { "1": 1, "2": 2 }],
 			[1, { "1": 3, "2": 4 }],
 			[0, { "1": 5, "2": 6 }],
 			[1, { "1": 7, "2": 8 }],
 			[0, { "1": 9, "2": 10 }],
 			[1, { "1": 11, "2": 12 }],
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

		expect(dataFrame.getColumnNames()).to.eql(['Column1']); // 2nd column is ignored because it is not part of the first object.
		expect(dataFrame.toValues()).to.eql([
			['A'],
			[undefined],
		]);
	});	

	it('can generate series from range', function () {

		var series = dataForge.range(10, 5);
		expect(series.toPairs()).to.eql([
			[0, 10],
			[1, 11],
			[2, 12],
			[3, 13],
			[4, 14],
		]);

	});

	it('can zip multiple series', function () {

		var series1 = dataForge.range(0, 3);
		var series2 = dataForge.range(10, 3);
		var series3 = dataForge.range(100, 3);

		var zipped = dataForge.zipSeries([series1, series2, series3], 
			function (values) {
				return E.from(values).sum();
			}
		);

		expect(zipped.toPairs()).to.eql([
			[0,
				0+10+100
			],
			[1,
				1+11+101
			],
			[2,
				2+12+102
			],
		]);
	});

	it('can zip multiple series with ragged rows', function () {

		var series1 = dataForge.range(0, 3);
		var series2 = dataForge.range(10, 2);
		var series3 = dataForge.range(100, 3);

		var zipped = dataForge.zipSeries([series1, series2, series3], 
			function (values) {
				return E.from(values).sum();
			}
		);

		expect(zipped.toPairs()).to.eql([
			[0,
				0+10+100
			],
			[1,
				1+11+101
			],
		]);
	});

	it('can zip multiple data-frames', function () {

	 	var df1 = initDataFrame(["a", "b"], [[1, 2], [3, 4]]);
	 	var df2 = initDataFrame(["c", "d"], [[6, 5], [8, 7]]);
	 	var df3 = initDataFrame(["e", "f"], [[9, 10], [11, 12]]);

		var zipped = dataForge.zipDataFrames([df1, df2, df3],
			function (rows) {
				return extend({}, rows[0], rows[1], rows[2]);
			}
		);

		expect(zipped.toPairs()).to.eql([
			[0,
				{
					a: 1,
					b: 2,
					c: 6,
					d: 5,
					e: 9,
					f: 10,
				}
			],			
			[1,
				{
					a: 3,
					b: 4,
					c: 8,
					d: 7,
					e: 11,
					f: 12,
				}
			],
		]);
	});

	it('can zip multiple data-frames with ragged rows', function () {

	 	var df1 = initDataFrame(["a", "b"], [[1, 2], [3, 4]]);
	 	var df2 = initDataFrame(["c", "d"], [[6, 5], ]);
	 	var df3 = initDataFrame(["e", "f"], [[9, 10], [11, 12]]);

		var zipped = dataForge.zipDataFrames([df1, df2, df3],
			function (rows) {
				return extend({}, rows[0], rows[1], rows[2]);
			}
		);

		expect(zipped.toPairs()).to.eql([
			[0,
				{
					a: 1,
					b: 2,
					c: 6,
					d: 5,
					e: 9,
					f: 10,
				}
			],			
		]);
	});

	it('can register plugin', function () {

		var called = false;

		var plugin = function (passedInDataForge) {
			expect(passedInDataForge).to.equal(dataForge);
			called = true;
		};

		dataForge.use(plugin);

		expect(called).to.equal(true);

	});

	it('registering plugin more than once has no effect', function () {

		var called = 0;

		var plugin = function (passedInDataForge) {
			expect(passedInDataForge).to.equal(dataForge);
			++called;
		};

		dataForge.use(plugin);
		dataForge.use(plugin);

		expect(called).to.equal(1);

	});
});
