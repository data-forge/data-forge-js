'use strict';

describe('zip', function () {

	var expect = require('chai').expect;
	var E = require('linq');
	var extend = require('extend');

	var Series = require('../src/series');
	var DataFrame = require('../src/dataframe');
	var dataForge = require('../index');

	it('can zip multiple series', function () {

		var series1 = dataForge.range(0, 3);
		var series2 = dataForge.range(10, 3);
		var series3 = dataForge.range(100, 3);

		var zipped = dataForge.zipSeries([series1, series2, series3], 
			function (values) {
				return values.sum();
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
				return values.sum();
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

	 	var df1 = new DataFrame({ columnNames: ["a", "b"], values: [[1, 2], [3, 4]] });
	 	var df2 = new DataFrame({ columnNames: ["c", "d"], values: [[6, 5], [8, 7]] });
	 	var df3 = new DataFrame({ columnNames: ["e", "f"], values: [[9, 10], [11, 12]] });

		var zipped = dataForge.zipDataFrames([df1, df2, df3],
			function (rows) {
				return extend({}, rows.at(0), rows.at(1), rows.at(2));
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

	 	var df1 = new DataFrame({ columnNames: ["a", "b"], values: [[1, 2], [3, 4]] });
	 	var df2 = new DataFrame({ columnNames: ["c", "d"], values: [[6, 5]] });
	 	var df3 = new DataFrame({ columnNames: ["e", "f"], values: [[9, 10], [11, 12]] });

		var zipped = dataForge.zipDataFrames([df1, df2, df3],
			function (rows) {
				return extend({}, rows.at(0), rows.at(1), rows.at(2));
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

	it('can zip two series', function () {

		var zipped = dataForge.range(0, 3)
			.zip(dataForge.range(10, 3), function (s1, s2) {
				return s1 + s2;
			});

		expect(zipped.toArray()).to.eql([0+10, 1+11, 2+12]);
	});

	it('can zip multiple series', function () {

		var zipped = dataForge.range(0, 3)
			.zip(
				dataForge.range(10, 3), 
				dataForge.range(100, 3),
				function (s1, s2, s3) {
					return s1 + s2 + s3;
				}
			);

		expect(zipped.toArray()).to.eql([0+10+100, 1+11+101, 2+12+102]);
	});

	it('zip preserves the index of the first series', function () {

		var s1 = new Series({ 
			values: [1, 2, 3],
			index: [10, 11, 12],
		});

		var s2 = new Series({ 
			values: [10, 20, 30],
			index: [50, 51, 52],
		});

		var zipped = s1.zip(s2, 
				function (s1, s2) {
				return s1 + s2;
				}
			);

		expect(zipped.toPairs()).to.eql([
			[10, 1+10],
			[11, 2+20],
			[12, 3+30],
		]);
	});

	it('can zip multiple data-frames', function () {

		var df1 = new DataFrame({
			columnNames: ["a", "b"],
			values: [[1, 2], [3, 4]],
		});

		var df2 = new DataFrame({
			columnNames: ["c", "d"],
			values: [[6, 5], [8, 7]],
		});

		var df3 = new DataFrame({
			columnNames: ["e", "f"],
			values: [[9, 10], [11, 12]],
		});				

		var zipped = df1.zip(df2, df3, function (row1, row2, row3) {
				return extend({}, row1, row2, row3);
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

	it('zip preserves index of first dataframe', function () {

		var df1 = new DataFrame({
			columnNames: ["c"],
			values: [[1], [2]],
			index: [20, 27],
		});

		var df2 = new DataFrame({
			columnNames: ["x"],
			values: [[100], [200]],
			index: [30, 62],
		});

		var zipped = df1.zip(df2, 
				function (row1, row2) {
					return extend({}, row1, row2);
				}
			);

		expect(zipped.toPairs()).to.eql([
			[20,
				{
					c: 1,
					x: 100,
				}
			],			
			[27,
				{
					c: 2,
					x: 200,
				}
			],
		]);
	});
});

