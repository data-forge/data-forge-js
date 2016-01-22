'use strict';


describe('BaseDataFrame', function () {
	
	var dataForge = require('../index');	
	var BaseDataFrame = require('../src/basedataframe');
	
	var expect = require('chai').expect;
	var assert = require('chai').assert;
	var E = require('linq');

	var initDataFrame = function (columns, values, index) {
		assert.isArray(columns);
		assert.isArray(values);
		assert.isArray(index);

		var dataFrame = new BaseDataFrame();

		dataFrame.getColumnNames = function () {
			return columns; 
		};

		dataFrame.getIterator = function () {
			var valueIndex = -1;

			return {
				moveNext: function () {
					return ++valueIndex < values.length;
				},

				getCurrent: function () {
					return values[valueIndex];
				},
			}
		};
		
		dataFrame.getIndex = function () {
			return new dataForge.Index(index);
		};
		
		return dataFrame;
	};

	it('can get column index from name', function () {
		var dataFrame = initDataFrame(
			[ "Date", "Value1", "Value2", "Value3" ],
			[],
			[]
		);

		expect(dataFrame.getColumnIndex("Date")).to.eql(0);
		expect(dataFrame.getColumnIndex("Value1")).to.eql(1);
		expect(dataFrame.getColumnIndex("Value2")).to.eql(2);
		expect(dataFrame.getColumnIndex("Value3")).to.eql(3);
	});

	it('can bake values from enumerator', function () {

		var dataFrame = initDataFrame(
				[ "Date", "Value1", "Value2", "Value3" ],
				[
					[new Date(2011, 24, 2), 300, 'c', 3],
					[new Date(1975, 24, 2), 200, 'b', 1],
					[new Date(2013, 24, 2), 20, 'c', 22],
					[new Date(2015, 24, 2), 100, 'd', 4],
				],
				[5, 6, 7, 8]
			);
		expect(dataFrame.toValues()).to.eql([
			[new Date(2011, 24, 2), 300, 'c', 3],
			[new Date(1975, 24, 2), 200, 'b', 1],
			[new Date(2013, 24, 2), 20, 'c', 22],
			[new Date(2015, 24, 2), 100, 'd', 4],
		]);
	});
	
	it('can skip', function () {
		var dataFrame = initDataFrame(
			[ "Date", "Value1", "Value2", "Value3" ],
			[
				[new Date(2011, 24, 2), 300, 'c', 3],
				[new Date(1975, 24, 2), 200, 'b', 1],
				[new Date(2013, 24, 2), 20, 'c', 22],
				[new Date(2015, 24, 2), 100, 'd', 4],
			],
			[5, 6, 7, 8]
		);
		var skipped = dataFrame.skip(2);		
		expect(skipped.getIndex().toValues()).to.eql([7, 8]);
		expect(skipped.toValues()).to.eql([
			[new Date(2013, 24, 2), 20, 'c', 22],
			[new Date(2015, 24, 2), 100, 'd', 4],
		]);		
	});

	it('can take', function () {
		var dataFrame = initDataFrame(
			[ "Date", "Value1", "Value2", "Value3" ],
			[
				[new Date(2011, 24, 2), 300, 'c', 3],
				[new Date(1975, 24, 2), 200, 'b', 1],
				[new Date(2013, 24, 2), 20, 'c', 22],
				[new Date(2015, 24, 2), 100, 'd', 4],
			],
			[5, 6, 7, 8]
		);
		var skipped = dataFrame.take(2);		
		expect(skipped.getIndex().toValues()).to.eql([5, 6]);
		expect(skipped.toValues()).to.eql([
			[new Date(2011, 24, 2), 300, 'c', 3],
			[new Date(1975, 24, 2), 200, 'b', 1],
		]);		
	});

	it('can filter', function () {
		var dataFrame = initDataFrame(
			[ "Date", "Value1", "Value2", "Value3" ],
			[
				[new Date(2011, 24, 2), 300, 'c', 3],
				[new Date(1975, 24, 2), 200, 'b', 1],
				[new Date(2013, 24, 2), 20, 'c', 22],
				[new Date(2015, 24, 2), 100, 'd', 4],
			],
			[5, 6, 7, 8]
		);
		var filtered = dataFrame.where(function (row) {
				return row.Value1 >= 100 && row.Value1 < 300;
			});		
		expect(filtered.getIndex().toValues()).to.eql([6, 8]);
		expect(filtered.toValues()).to.eql([
				[new Date(1975, 24, 2), 200, 'b', 1],
				[new Date(2015, 24, 2), 100, 'd', 4],
		]);		
	});

	it('can select', function () {
		var dataFrame = initDataFrame(
			[ "Date", "Value1", "Value2", "Value3" ],
			[
				[new Date(2011, 24, 2), 300, 'c', 3],
				[new Date(1975, 24, 2), 200, 'b', 1],
				[new Date(2013, 24, 2), 20, 'c', 22],
				[new Date(2015, 24, 2), 100, 'd', 4],
			],
			[5, 6, 7, 8]
		);
		var modified = dataFrame.select(function (row) {
				return {
					Test1: row.Value1 + 10,
					Test2: row.Value2,
				};
			});		
		expect(modified.getIndex().toValues()).to.eql([5, 6, 7, 8]);
		expect(modified.getColumnNames()).to.eql(["Test1", "Test2"]);
		expect(modified.toValues()).to.eql([
				[310, 'c'],
				[210, 'b'],
				[30, 'c'],
				[110, 'd'],
		]);		
	});

	it('can select many', function () {
		var dataFrame = initDataFrame(
			[ "Date", "Value1", "Value2", "Value3" ],
			[
				[new Date(2011, 24, 2), 300, 'c', 3],
				[new Date(1975, 24, 2), 200, 'b', 1],
				[new Date(2013, 24, 2), 20, 'c', 22],
				[new Date(2015, 24, 2), 100, 'd', 4],
			],
			[5, 6, 7, 8]
		);
		var modified = dataFrame.selectMany(function (row) {
				return E.range(0, 2).
					select(function (i) {
						return {
							TestA: row.Value1 + i + 1,
							TestB: row.Value2,
						};					
					})
					.toArray();
			});		
		expect(modified.getIndex().toValues()).to.eql([5, 5, 6, 6, 7, 7, 8, 8]);
		expect(modified.getColumnNames()).to.eql(["TestA", "TestB"]);
		expect(modified.toValues()).to.eql([
				[301, 'c'],
				[302, 'c'],
				[201, 'b'],
				[202, 'b'],
				[21, 'c'],
				[22, 'c'],
				[101, 'd'],
				[102, 'd'],
		]);		
	});

	it('throws exception when pulling a non-existing column name', function () {
		
		expect(function () {
			var dataFrame = initDataFrame(
				[ "Date", "Value1", "Value2", "Value3" ],
				[
					[new Date(1975, 24, 2), 100, 'foo', 11],
					[new Date(2015, 24, 2), 200, 'bar', 22],
				],
				[5, 6]
			);
			dataFrame.setSeries('non-existing column name');			
		}).to.throw(Error);
	});

	it('can check that column exists', function () {
		
		var dataFrame = initDataFrame(
			[ "Date", "Value1", "Value2", "Value3" ],
			[
				[new Date(1975, 24, 2), 100, 'foo', 11],
				[new Date(2015, 24, 2), 200, 'bar', 22],
			],
			[5, 6]
		);
		
		expect(dataFrame.hasSeries('non-existing-column')).to.eql(false);
		expect(dataFrame.hasSeries('Value1')).to.eql(true);
		expect(dataFrame.hasSeries('Value2')).to.eql(true);
		expect(dataFrame.hasSeries('Value3')).to.eql(true);
	});

	it('can expect that a column exists', function () {
		
		var dataFrame = initDataFrame(
			[ "Value1" ],
			[
				[100],
				[200],
			],
			[5, 6]
		);
		
		expect(function () {
				dataFrame.expectSeries('non-existing-column')
			}).to.throw();

		expect(dataFrame.expectSeries('Value1')).to.eql(dataFrame);
	});

	it('can retreive column by name', function () {
		
		var dataFrame = initDataFrame(
			[ "Date", "Value1", "Value2", "Value3" ],
			[
				[new Date(1975, 24, 2), 100, 'foo', 11],
				[new Date(2015, 24, 2), 200, 'bar', 22],
			],
			[5, 6]
		);
		
		var series1 = dataFrame.getSeries('Value1');
		expect(series1.getIndex().toValues()).to.eql([5, 6]);
		expect(series1.toValues()).to.eql([100, 200]);
		
		var series2 = dataFrame.getSeries('Value2');
		expect(series2.getIndex().toValues()).to.eql([5, 6]);
		expect(series2.toValues()).to.eql(['foo', 'bar']);
		
		var series3 = dataFrame.getSeries('Value3');
		expect(series3.getIndex().toValues()).to.eql([5, 6]);
		expect(series3.toValues()).to.eql([11, 22]);
	});

	it('can retreive column by index', function () {
		
		var dataFrame = initDataFrame(
			[ "Date", "Value1", "Value2", "Value3" ],
			[
				[new Date(1975, 24, 2), 100, 'foo', 11],
				[new Date(2015, 24, 2), 200, 'bar', 22],
			],
			[5, 6]
		);
		var series1 = dataFrame.getSeries(1);
		expect(series1.getIndex().toValues()).to.eql([5, 6]);
		expect(series1.toValues()).to.eql([100, 200]);
		
		var series2 = dataFrame.getSeries(2);
		expect(series2.getIndex().toValues()).to.eql([5, 6]);
		expect(series2.toValues()).to.eql(['foo', 'bar']);
		
		var series3 = dataFrame.getSeries(3);
		expect(series3.getIndex().toValues()).to.eql([5, 6]);
		expect(series3.toValues()).to.eql([11, 22]);
	});

	it('can retreive columns', function () {
		
		var dataFrame = initDataFrame(
			[ "Date", "Value1", "Value2", "Value3" ],
			[
				[new Date(1975, 24, 2), 100, 'foo', 11],
				[new Date(2015, 24, 2), 200, 'bar', 22],
			],
			[5, 6]
		);
		var columns = dataFrame.getColumns();
		expect(columns.length).to.eql(4);

		expect(columns[0].getName()).to.eql('Date');
		expect(columns[0].getSeries().toValues()).to.eql([new Date(1975, 24, 2), new Date(2015, 24, 2)]);

		expect(columns[2].getName()).to.eql('Value2');
		expect(columns[2].getSeries().toValues()).to.eql(['foo', 'bar']);
	});
	
	it('can retreive column subset as new dataframe', function () 
	{
		var dataFrame = initDataFrame(
			[ "Date", "Value1", "Value2", "Value3" ],
			[
				[new Date(1975, 24, 2), 100, 'foo', 11],
				[new Date(2015, 24, 2), 200, 'bar', 22],
			],
			[5, 6]
		);
		var subset = dataFrame.getColumnsSubset(['Value3', 'Value1']);
		expect(dataFrame).not.to.equal(subset); 
		expect(subset.getIndex().toValues()).to.eql([5, 6]);
		expect(subset.toValues()).to.eql([
			[11, 100],
			[22, 200],
		]);
	});
	
	it('can sort by single column ascending', function () {
		
		var dataFrame = initDataFrame(
			[ "Date", "Value1", "Value2", "Value3" ],
			[
				[new Date(2011, 24, 2), 300, 'c', 3],
				[new Date(1975, 24, 2), 200, 'b', 1],
				[new Date(2013, 24, 2), 20, 'c', 22],
				[new Date(2015, 24, 2), 100, 'd', 4],
			],
			[5, 6, 7, 8]
		);
		var sorted = dataFrame.orderBy('Value1');
		expect(sorted.getIndex().toValues()).to.eql([7, 8, 6, 5]);
		expect(sorted.toValues()).to.eql([
			[new Date(2013, 24, 2), 20, 'c', 22],
			[new Date(2015, 24, 2), 100, 'd', 4],
			[new Date(1975, 24, 2), 200, 'b', 1],
			[new Date(2011, 24, 2), 300, 'c', 3],
		]);
	});
	
	it('can sort by multiple columns ascending', function () {
		
		var dataFrame = initDataFrame(
			[ "Date", "Value1", "Value2", "Value3" ],
			[
				[new Date(2011, 24, 2), 300, 'c', 3],
				[new Date(1975, 24, 2), 200, 'b', 1],
				[new Date(2013, 24, 2), 20, 'c', 22],
				[new Date(2015, 24, 2), 100, 'd', 4],
			],
			[5, 6, 7, 8]
		);
		var sorted = dataFrame.orderBy('Value2').thenBy('Value1');
		expect(sorted.getIndex().toValues()).to.eql([6, 7, 5, 8]);
		expect(sorted.toValues()).to.eql([
			[new Date(1975, 24, 2), 200, 'b', 1],
			[new Date(2013, 24, 2), 20, 'c', 22],
			[new Date(2011, 24, 2), 300, 'c', 3],
			[new Date(2015, 24, 2), 100, 'd', 4],
		]);
	});

	it('can sort by 3 columns ascending', function () {
		
		var dataFrame = initDataFrame(
			[ "Date", "Value1", "Value2", "Value3" ],
			[
				[new Date(2011, 24, 2), 300, 'c', 3],
				[new Date(1975, 24, 2), 200, 'b', 1],
				[new Date(2013, 24, 2), 20, 'c', 22],
				[new Date(2015, 24, 2), 100, 'd', 4],
			],
			[5, 6, 7, 8]
		);
		var sorted = dataFrame.orderBy('Value2').thenBy('Value1').thenBy('Value3');
		expect(sorted.getIndex().toValues()).to.eql([6, 7, 5, 8]);
		expect(sorted.toValues()).to.eql([
			[new Date(1975, 24, 2), 200, 'b', 1],
			[new Date(2013, 24, 2), 20, 'c', 22],
			[new Date(2011, 24, 2), 300, 'c', 3],
			[new Date(2015, 24, 2), 100, 'd', 4],
		]);
	});

	it('can sort by single column descending', function () {
		
		var dataFrame = initDataFrame(
			[ "Date", "Value1", "Value2", "Value3" ],
			[
				[new Date(2011, 24, 2), 300, 'c', 3],
				[new Date(1975, 24, 2), 200, 'b', 1],
				[new Date(2013, 24, 2), 20, 'c', 22],
				[new Date(2015, 24, 2), 100, 'd', 4],
			],
			[5, 6, 7, 8]
		);
		var sorted = dataFrame.orderByDescending('Value3');
		expect(sorted.getIndex().toValues()).to.eql([7, 8, 5, 6]);
		expect(sorted.toValues()).to.eql([
			[new Date(2013, 24, 2), 20, 'c', 22],
			[new Date(2015, 24, 2), 100, 'd', 4],
			[new Date(2011, 24, 2), 300, 'c', 3],
			[new Date(1975, 24, 2), 200, 'b', 1],
		]);
	});

	it('can sort by multiple column descending', function () {
		
		var dataFrame = initDataFrame(
			[ "Date", "Value1", "Value2", "Value3" ],
			[
				[new Date(2011, 24, 2), 300, 'c', 3],
				[new Date(1975, 24, 2), 200, 'b', 1],
				[new Date(2013, 24, 2), 20, 'c', 22],
				[new Date(2015, 24, 2), 100, 'd', 4],
			],
			[5, 6, 7, 8]
		);
		var sorted = dataFrame.orderByDescending('Value2').thenByDescending('Value3');
		expect(sorted.getIndex().toValues()).to.eql([8, 7, 5, 6]);
		expect(sorted.toValues()).to.eql([
			[new Date(2015, 24, 2), 100, 'd', 4],
			[new Date(2013, 24, 2), 20, 'c', 22],
			[new Date(2011, 24, 2), 300, 'c', 3],
			[new Date(1975, 24, 2), 200, 'b', 1],
		]);
	});

	it('can sort by 3 columns descending', function () {
		
		var dataFrame = initDataFrame(
			[ "Date", "Value1", "Value2", "Value3" ],
			[
				[new Date(2011, 24, 2), 300, 'c', 3],
				[new Date(1975, 24, 2), 200, 'b', 1],
				[new Date(2013, 24, 2), 20, 'c', 22],
				[new Date(2015, 24, 2), 100, 'd', 4],
			],
			[5, 6, 7, 8]
		);
		var sorted = dataFrame.orderByDescending('Value2').thenByDescending('Value3').thenByDescending('Value1');
		expect(sorted.getIndex().toValues()).to.eql([8, 7, 5, 6]);
		expect(sorted.toValues()).to.eql([
			[new Date(2015, 24, 2), 100, 'd', 4],
			[new Date(2013, 24, 2), 20, 'c', 22],
			[new Date(2011, 24, 2), 300, 'c', 3],
			[new Date(1975, 24, 2), 200, 'b', 1],
		]);
	});

	it('can sort by selector ascending', function () {
		
		var dataFrame = initDataFrame(
			[ "Date", "Value1", "Value2", "Value3" ],
			[
				[new Date(2011, 24, 2), 300, 'c', 3],
				[new Date(1975, 24, 2), 200, 'b', 1],
				[new Date(2013, 24, 2), 20, 'c', 22],
				[new Date(2015, 24, 2), 100, 'd', 4],
			],
			[5, 6, 7, 8]
		);
		var sorted = dataFrame
			.orderBy(function (row) {
				return row.Value2;
			})
			.thenBy(function (row) {
				return row.Value1;
			});
		expect(sorted.getIndex().toValues()).to.eql([6, 7, 5, 8]);
		expect(sorted.toValues()).to.eql([
			[new Date(1975, 24, 2), 200, 'b', 1],
			[new Date(2013, 24, 2), 20, 'c', 22],
			[new Date(2011, 24, 2), 300, 'c', 3],
			[new Date(2015, 24, 2), 100, 'd', 4],
		]);
	});

	it('can sort by selector descending', function () {
		
		var dataFrame = initDataFrame(
			[ "Date", "Value1", "Value2", "Value3" ],
			[
				[new Date(2011, 24, 2), 300, 'c', 3],
				[new Date(1975, 24, 2), 200, 'b', 1],
				[new Date(2013, 24, 2), 20, 'c', 22],
				[new Date(2015, 24, 2), 100, 'd', 4],
			],
			[5, 6, 7, 8]
		);
		var sorted = dataFrame
			.orderByDescending(function (row) {
				return row.Value2;
			})
			.thenByDescending(function (row) {
				return row.Value1;
			});
		expect(sorted.getIndex().toValues()).to.eql([8, 5, 7, 6]);
		expect(sorted.toValues()).to.eql([
			[new Date(2015, 24, 2), 100, 'd', 4],
			[new Date(2011, 24, 2), 300, 'c', 3],
			[new Date(2013, 24, 2), 20, 'c', 22],
			[new Date(1975, 24, 2), 200, 'b', 1],
		]);
	});

	it('can sort by column index - ascending', function () {
		
		var dataFrame = initDataFrame(
			[ "Date", "Value1", "Value2", "Value3" ],
			[
				[new Date(2011, 24, 2), 300, 'c', 3],
				[new Date(1975, 24, 2), 200, 'b', 1],
				[new Date(2013, 24, 2), 20, 'c', 22],
				[new Date(2015, 24, 2), 100, 'd', 4],
			],
			[5, 6, 7, 8]
		);
		var sorted = dataFrame
			.orderBy(2)
			.thenBy(1);
		expect(sorted.getIndex().toValues()).to.eql([6, 7, 5, 8]);
		expect(sorted.toValues()).to.eql([
			[new Date(1975, 24, 2), 200, 'b', 1],
			[new Date(2013, 24, 2), 20, 'c', 22],
			[new Date(2011, 24, 2), 300, 'c', 3],
			[new Date(2015, 24, 2), 100, 'd', 4],
		]);
	});

	it('can sort by column index - descending', function () {
		
		var dataFrame = initDataFrame(
			[ "Date", "Value1", "Value2", "Value3" ],
			[
				[new Date(2011, 24, 2), 300, 'c', 3],
				[new Date(1975, 24, 2), 200, 'b', 1],
				[new Date(2013, 24, 2), 20, 'c', 22],
				[new Date(2015, 24, 2), 100, 'd', 4],
			],
			[5, 6, 7, 8]
		);
		var sorted = dataFrame
			.orderByDescending(2)
			.thenByDescending(1);
		expect(sorted.getIndex().toValues()).to.eql([8, 5, 7, 6]);
		expect(sorted.toValues()).to.eql([
			[new Date(2015, 24, 2), 100, 'd', 4],
			[new Date(2011, 24, 2), 300, 'c', 3],
			[new Date(2013, 24, 2), 20, 'c', 22],
			[new Date(1975, 24, 2), 200, 'b', 1],
		]);
	});

	it('can drop column', function () {
		
		var dataFrame = initDataFrame(
			[ "Date", "Value1", "Value2", "Value3" ],
			[
				[new Date(2011, 24, 2), 300, 'c', 3],
				[new Date(1975, 24, 2), 200, 'b', 1],
				[new Date(2013, 24, 2), 20, 'c', 22],
				[new Date(2015, 24, 2), 100, 'd', 4],
			],
			[5, 6, 7, 8]
		);
		var modified = dataFrame.dropColumn('Date');
		expect(modified.getIndex().toValues()).to.eql([5, 6, 7, 8]);
		expect(modified.toValues()).to.eql([
			[300, 'c', 3],
			[200, 'b', 1],
			[20, 'c', 22],
			[100, 'd', 4],
		]);
	});

	it('can drop multiple columns', function () {
		
		var dataFrame = initDataFrame(
			[ "Date", "Value1", "Value2", "Value3" ],
			[
				[new Date(2011, 24, 2), 300, 'c', 3],
				[new Date(1975, 24, 2), 200, 'b', 1],
				[new Date(2013, 24, 2), 20, 'c', 22],
				[new Date(2015, 24, 2), 100, 'd', 4],
			],
			[5, 6, 7, 8]
		);
		var modified = dataFrame.dropColumn(['Date', 'Value2'])
		expect(modified.getIndex().toValues()).to.eql([5, 6, 7, 8]);
		expect(modified.toValues()).to.eql([
			[300, 3],
			[200, 1],
			[20, 22],
			[100, 4],
		]);
	});

	it('dropping non-existing column has no effect', function () {
		
		var columnNames = [ "Date", "Value1", "Value2", "Value3" ];
		var dataFrame = initDataFrame(
			columnNames,
			[
				[new Date(2011, 24, 2), 300, 'c', 3],
				[new Date(1975, 24, 2), 200, 'b', 1],
				[new Date(2013, 24, 2), 20, 'c', 22],
				[new Date(2015, 24, 2), 100, 'd', 4],
			],
			[5, 6, 7, 8]
		);
		var modified = dataFrame.dropColumn('non-existing-column');
		expect(modified.getIndex().toValues()).to.eql([5, 6, 7, 8]);
		expect(modified.getColumnNames()).to.eql(columnNames);
		expect(modified.toValues()).to.eql([
				[new Date(2011, 24, 2), 300, 'c', 3],
				[new Date(1975, 24, 2), 200, 'b', 1],
				[new Date(2013, 24, 2), 20, 'c', 22],
				[new Date(2015, 24, 2), 100, 'd', 4],
		]);
	});

	it('can add column', function () {
		
		var dataFrame = initDataFrame(
			[ "Date", "Value1", "Value2", "Value3" ],
			[
				[new Date(2011, 24, 2), 300, 'c', 3],
				[new Date(1975, 24, 2), 200, 'b', 1],
				[new Date(2013, 24, 2), 20, 'c', 22],
				[new Date(2015, 24, 2), 100, 'd', 4],
			],
			[5, 6, 7, 8]
		);
		var modified = dataFrame.setSeries('Value4', [1, 2, 3, 4]);
		expect(modified.getIndex().toValues()).to.eql([5, 6, 7, 8]);
		expect(modified.getColumnNames()).to.eql([
			"Date",
			"Value1",
			"Value2",
			"Value3",
			"Value4",
		]);
		expect(modified.toValues()).to.eql([
			[new Date(2011, 24, 2), 300, 'c', 3, 1],
			[new Date(1975, 24, 2), 200, 'b', 1, 2],
			[new Date(2013, 24, 2), 20, 'c', 22, 3],
			[new Date(2015, 24, 2), 100, 'd', 4, 4],
		]);
	});

	it('can overwrite column', function () {
		
		var dataFrame = initDataFrame(
			[ "Date", "Value1", "Value2", "Value3" ],
			[
				[new Date(2011, 24, 2), 300, 'c', 3],
				[new Date(1975, 24, 2), 200, 'b', 1],
				[new Date(2013, 24, 2), 20, 'c', 22],
				[new Date(2015, 24, 2), 100, 'd', 4],
			],
			[5, 6, 7, 8]
		);
		var modified = dataFrame.setSeries('Value1', [1, 2, 3, 4]);
		expect(modified.getIndex().toValues()).to.eql([5, 6, 7, 8]);
		expect(modified.toValues()).to.eql([
			[new Date(2011, 24, 2), 1, 'c', 3],
			[new Date(1975, 24, 2), 2, 'b', 1],
			[new Date(2013, 24, 2), 3, 'c', 22],
			[new Date(2015, 24, 2), 4, 'd', 4],		
		]);
	});

	it('can add column from other data frame', function () {
		
		var dataFrame1 = initDataFrame(
			[ "Date", "Value1", "Value2", "Value3" ],
			[
				[new Date(1975, 24, 2), 100, 'foo', 11],
				[new Date(2015, 24, 2), 200, 'bar', 22],
			],
			[5, 6]
		);
		var dataFrame2 = initDataFrame(
			[ "Date", "Value1", "Value2", "Value3" ],
			[
				[new Date(2011, 24, 2), 300, 'c', 3],
				[new Date(1975, 24, 2), 200, 'b', 1],
				[new Date(2013, 24, 2), 20, 'c', 22],
				[new Date(2015, 24, 2), 100, 'd', 4],
			],
			[5, 6, 7, 8]
		);
		var modified = dataFrame2.setSeries('Value4', dataFrame1.getSeries('Value2'));
		expect(modified.getColumnNames()).to.eql([
			"Date",
			"Value1",
			"Value2",
			"Value3",
			"Value4",
		]);
		expect(modified.toValues()).to.eql([
			[new Date(2011, 24, 2), 300, 'c', 3, 'foo'],
			[new Date(1975, 24, 2), 200, 'b', 1, 'bar'],
			[new Date(2013, 24, 2), 20, 'c', 22, undefined],
			[new Date(2015, 24, 2), 100, 'd', 4, undefined],
		]);
	});

	it('column being merged is reindexed', function () {

		var dataFrame = initDataFrame(
			[ "Date", "Value1", "Value2", "Value3" ],
			[
				[new Date(2011, 24, 2), 300, 'c', 3],
				[new Date(1975, 24, 2), 200, 'b', 1],
				[new Date(2013, 24, 2), 20, 'c', 22],
				[new Date(2015, 24, 2), 100, 'd', 4],
			],
			[5, 6, 7, 8]
		);
		
		var newColumnName = "new column";
		var newIndex = new dataForge.Index([0, 5, 2, 7]);
		var newSeries = new dataForge.Series([4, 3, 2, 1], newIndex);
		var modified = dataFrame.setSeries(newColumnName, newSeries);
		var mergedSeries = modified.getSeries(newColumnName);

		expect(modified.getIndex().toValues()).to.eql([5, 6, 7, 8]);
		expect(modified.getColumnNames()).to.eql([
			"Date",
			"Value1",
			"Value2",
			"Value3",
			newColumnName,
		]);
		expect(modified.toValues()).to.eql([
			[new Date(2011, 24, 2), 300, 'c', 3, 3],
			[new Date(1975, 24, 2), 200, 'b', 1, undefined],
			[new Date(2013, 24, 2), 20, 'c', 22, 1],
			[new Date(2015, 24, 2), 100, 'd', 4, undefined],
		]);

		expect(mergedSeries.getIndex().toValues()).to.eql([5, 6, 7, 8]);
		expect(mergedSeries.toValues()).to.eql([3, undefined, 1, undefined]);
	});

	it('can set column procedurally from a function', function () {

		var original = initDataFrame(
			[ "Existing" ],
			[
				[11],
				[12],
			],
			[5, 6]
		);		

		var modified = original.setSeries('Generated', 
				function (row) {
					return row.Existing * 2;
				}
			);
		expect(original.getColumnNames()).to.eql(["Existing"]);
		expect(modified.getColumnNames()).to.eql(["Existing", "Generated"]);
		expect(modified.getSeries("Existing").toValues()).to.eql([11, 12]);
		expect(modified.getSeries("Generated").toValues()).to.eql([22, 24]);
	});

	it('can get subset of rows', function () {

		var dataFrame = initDataFrame(
			[ "Date", "Value1", "Value2", "Value3" ],
			[
				[new Date(2011, 24, 2), 300, 'c', 3],
				[new Date(1975, 24, 2), 200, 'b', 1],
				[new Date(2013, 24, 2), 20, 'c', 22],
				[new Date(2015, 24, 2), 100, 'd', 4],
			],
			[5, 6, 7, 8]
		);
		var subset = dataFrame.getRowsSubset(1, 3);
		expect(subset.getIndex().toValues()).to.eql([6, 7]);
		expect(subset.toValues()).to.eql([
			[new Date(1975, 24, 2), 200, 'b', 1],
			[new Date(2013, 24, 2), 20, 'c', 22],
		]);
	});

	it('can set index by column name', function () {

		var dataFrame = initDataFrame(
			[ "Date", "Value1", "Value2", "Value3" ],
			[
				[new Date(1975, 24, 2), 100, 'foo', 11],
				[new Date(2015, 24, 2), 200, 'bar', 22],
			],
			[5, 6]
		);
		var indexedDataFrame = dataFrame.setIndex("Date");

		expect(indexedDataFrame.getIndex().toValues()).to.eql([
			new Date(1975, 24, 2),
			new Date(2015, 24, 2)
		]);

		expect(indexedDataFrame.toValues()).to.eql([
			[new Date(1975, 24, 2), 100, 'foo', 11],
			[new Date(2015, 24, 2), 200, 'bar', 22],
		]);
	});

	it('can set index by column index', function () {

		var dataFrame = initDataFrame(
			[ "Date", "Value1", "Value2", "Value3" ],
			[
				[new Date(1975, 24, 2), 100, 'foo', 11],
				[new Date(2015, 24, 2), 200, 'bar', 22],
			],
			[5, 6]
		);
		var indexedDataFrame = dataFrame.setIndex(0);

		expect(indexedDataFrame.getIndex().toValues()).to.eql([
			new Date(1975, 24, 2),
			new Date(2015, 24, 2)
		]);

		expect(indexedDataFrame.toValues()).to.eql([
			[new Date(1975, 24, 2), 100, 'foo', 11],
			[new Date(2015, 24, 2), 200, 'bar', 22],
		]);
	});

	it('can reset index', function () {

		var dataFrame = initDataFrame(
			[ "Date", "Value1", "Value2", "Value3" ],
			[
				[new Date(1975, 24, 2), 100, 'foo', 11],
				[new Date(2015, 24, 2), 200, 'bar', 22],
			],
			[5, 6]
		);
		var dataFrameWithIndexReset = dataFrame.setIndex("Date").resetIndex();

		expect(dataFrameWithIndexReset.getIndex().toValues()).to.eql([
			0,
			1
		]);

		expect(dataFrameWithIndexReset.toValues()).to.eql([
			[new Date(1975, 24, 2), 100, 'foo', 11],
			[new Date(2015, 24, 2), 200, 'bar', 22],
		]);
	});

	it('can detect actual types', function () {

		var dataFrame = initDataFrame(
			[ "Date", "Value1" ],
			[
				[new Date(1975, 24, 2), 'foo'],
				[new Date(2015, 24, 2), 200],
			],
			[5, 6]
		);

		var detectedTypes = dataFrame.detectTypes();
		expect(detectedTypes.getColumnNames()).to.eql(["Type", "Frequency", "Column"]);
		expect(detectedTypes.getIndex().toValues()).to.eql([0, 1, 2]);
		expect(detectedTypes.toValues()).to.eql([
			['date', 100, "Date"],
			['string', 50, "Value1"],
			['number', 50, "Value1"],
		]);
	});

	it('can detect values', function () {

		var dataFrame = initDataFrame(
			[ "Date", "Value1" ],
			[
				[new Date(1975, 24, 2), 'foo'],
				[new Date(2015, 24, 2), 'foo'],
			],
			[5, 6]
		);

		var detectedTypes = dataFrame.detectValues();
		expect(detectedTypes.getColumnNames()).to.eql(["Value", "Frequency", "Column"]);
		expect(detectedTypes.getIndex().toValues()).to.eql([0, 1, 2]);
		expect(detectedTypes.toValues()).to.eql([
			[new Date(1975, 24, 2), 50, "Date"],
			[new Date(2015, 24, 2), 50, "Date"],
			['foo', 100, "Value1"],
		]);
	});

	it('can truncate string values', function () {

		var dataFrame = initDataFrame(
			["Col1", "Col2"],
			[
				["Long string", "Short"],
				["Small", "Even longer string"],
			],
			[1, 2]
		);

		var truncated = dataFrame.truncateStrings(10);
		expect(truncated.toValues()).to.eql([
			["Long strin", "Short"],
			["Small", "Even longe"],
		]);
	});

	it('can reorder existing columns', function () {

		var dataFrame = initDataFrame(
			[ "Col1", "Col2" ],
			[
				['foo', 11],
				['bar', 22],
			],
			[5, 6]
		);

		var remapped = dataFrame.remapColumns(["Col2", "Col1"]);

		expect(remapped.getColumnNames()).to.eql([ "Col2", "Col1" ]);
		expect(remapped.toValues()).to.eql([
			[11, 'foo'],
			[22, 'bar'],
		]);
	});

	it('columns not in remap table are dropped', function () {

		var dataFrame = initDataFrame(
			[ "Col1", "Col2" ],
			[
				['foo', 11],
				['bar', 22],
			],
			[5, 6]
		);

		var remapped = dataFrame.remapColumns(["Col2"]);

		expect(remapped.getColumnNames()).to.eql([ "Col2" ]);
		expect(remapped.toValues()).to.eql([
			[11],
			[22],
		]);
	});

	it('new columns in remap table are initialised to a column of empty values', function () {

		var dataFrame = initDataFrame(
			[ "Col1", "Col2" ],
			[
				['foo', 11],
				['bar', 22],
			],
			[5, 6]
		);

		var remapped = dataFrame.remapColumns(["New Column", "Col2"]);

		expect(remapped.getColumnNames()).to.eql([ "New Column", "Col2" ]);
		expect(remapped.toValues()).to.eql([
			[undefined, 11],
			[undefined, 22],
		]);
	});

	it('can rename columns', function () {

		var dataFrame = initDataFrame(
			[ "Col1", "Col2", "Col3" ],
			[
				[300, 'c', 3],
				[200, 'b', 1],
			],
			[5, 6]
		);

		var newColumnNames = ["Val1", "Val2", "Val3"];
		var renamed = dataFrame.renameColumns(newColumnNames);
		expect(renamed.getColumnNames()).to.eql(newColumnNames);
		var columns = renamed.getColumns();
		expect(columns.length).to.eql(3);
		expect(columns[0].getSeries().toValues()).to.eql([300, 200]);
		expect(columns[1].getSeries().toValues()).to.eql(['c', 'b']);
		expect(columns[2].getSeries().toValues()).to.eql([3, 1]);
	});

	it('can extract values as array objects', function () {

		var dataFrame = initDataFrame(
			[ "Col1", "Col2", "Col3" ],
			[
				[300, 'c', 3],
				[200, 'b', 1],
			],
			[5, 6]
		);

		expect(dataFrame.toObjects()).to.eql([
			{
				Col1: 300,
				Col2: 'c',
				Col3: 3,
			},
			{
				Col1: 200,
				Col2: 'b',
				Col3: 1,
			},
		]);
	});

	it('can save empty data frame to json', function () {

		var dataFrame = initDataFrame([], [], []);
		expect(dataFrame.toJSON()).to.eql("[]");
	});

	it('can save data frame to json', function () {

		var dataFrame = initDataFrame(
			["Column1", "Column2"], 
			[
				['A', 1],
				['B', 2],
			],
			[0, 1]
		);

		expect(dataFrame.toJSON()).to.eql(
			'[\n' +
			'    {\n' +
			'        "Column1": "A",\n' +
			'        "Column2": 1\n' +
			'    },\n' +
			'    {\n' +
			'        "Column1": "B",\n' +
			'        "Column2": 2\n' +
			'    }\n' +
			']'
		);
	});	

	it('can save empty data frame to csv', function () {

		var dataFrame = initDataFrame([], [], []);
		var csvData = dataFrame.toCSV();
		assert.isString(csvData);
		expect(csvData.length).to.eql(0);
	});

	it('can save data frame to csv', function () {

		var dataFrame = initDataFrame(
				["Column1", "Column2"], 
				[
					['A', 1],
					['B', 2],
				],
				[0, 1]
			);

		var csvData = dataFrame.toCSV();
		assert.isString(csvData);
		expect(csvData).to.eql(
			"Column1,Column2\r\n" +
			"A,1\r\n" +
			"B,2"
		);
	});

	it('can bake data frame', function () {

		var dataFrame = initDataFrame(
				["Column1", "Column2"], 
				[
					['A', 1],
					['B', 2],
				],
				[10, 11]
			);

		var baked = dataFrame.bake();
		expect(baked).not.to.equal(dataFrame);
		expect(baked).to.be.an.instanceOf(dataForge.DataFrame);
		expect(baked.getIndex()).not.to.equal(dataFrame.getIndex());
		expect(baked.getIndex()).to.be.an.instanceOf(dataForge.Index);
		expect(baked.getIndex().toValues()).to.eql([10, 11]);
		expect(baked.getColumnNames()).to.eql(["Column1", "Column2"]);
		expect(baked.toValues()).to.eql([
				['A', 1],
				['B', 2],
		]);


	});

	it('can rename column - specified by name', function () {

		var oldColumnName = "Column2";
		var dataFrame = initDataFrame(
				["Column1", oldColumnName, "Column3"], 
				[
					['A', 1],
					['B', 2],
				],
				[10, 11]
			);

		var newColumnName = "NewColumnName";
		var renamed = dataFrame.renameColumn(oldColumnName, newColumnName);

		expect(dataFrame.getColumnNames()[1]).to.eql(oldColumnName);

		expect(renamed.getColumnNames()[1]).to.eql(newColumnName);
		expect(renamed.getSeries(newColumnName)).to.be.ok;
	});

	it('can rename column - specified by index', function () {

		var oldColumnName = "Column2";
		var dataFrame = initDataFrame(
				["Column1", oldColumnName, "Column3"], 
				[
					['A', 1],
					['B', 2],
				],
				[10, 11]
			);

		var newColumnName = "NewColumnName";
		var renamed = dataFrame.renameColumn(1, newColumnName);

		expect(dataFrame.getColumnNames()[1]).to.eql(oldColumnName);

		expect(renamed.getColumnNames()[1]).to.eql(newColumnName);
		expect(renamed.getSeries(newColumnName)).to.be.ok;
	});

	it('renaming non-existing column has no effect', function () {

		var columnNames = ["Column1", "Column2", "Column3"];
		var dataFrame = initDataFrame(
				columnNames, 
				[
					['A', 1],
					['B', 2],
				],
				[10, 11]
			);

		var renamed = dataFrame.renameColumn("some-column-that-doesnt-exist", "new-column-name");

		expect(dataFrame.getColumnNames()).to.eql(columnNames);
		expect(dataFrame.getIndex().toValues()).to.eql([10, 11]);
		expect(dataFrame.toValues()).to.eql([
			['A', 1],
			['B', 2],
		]);
	});	

	it('can get pairs', function () {

		var dataFrame = initDataFrame(
				["Column1", "Column2"], 
				[
					['A', 1],
					['B', 2],
				],
				[10, 11]
			);
		expect(dataFrame.toPairs()).to.eql([
			[10, { Column1: 'A', Column2: 1 }],
			[11, { Column1: 'B', Column2: 2 }],
		]);
	});

	it('can get size', function () {

		var dataFrame = initDataFrame(
				["Column1", "Column2"], 
				[
					['A', 1],
					['B', 2],
				],
				[10, 11]
			);
		expect(dataFrame.count()).to.eql(2);
	});

	it('can transform column', function () {

		var dataFrame = initDataFrame(
				["Column1", "Column2"], 
				[
					['A', 1],
					['B', 2],
				],
				[10, 11]
			);
		var modified = dataFrame.transformColumn("Column2", function (value) {
				return value + 100;
			});
		expect(dataFrame.getSeries("Column2").toValues()).to.eql([1, 2]);
		expect(modified.getSeries("Column2").toValues()).to.eql([101, 102]);
	});

	it('transforming non-existing column has no effect', function () {

		var columnNames = ["Column1", "Column2"];
		var dataFrame = initDataFrame(
				columnNames, 
				[
					['A', 1],
					['B', 2],
				],
				[10, 11]
			);
		var modified = dataFrame.transformColumn("non-existing-column", function (value) {
				return value + 100;
			});
		expect(dataFrame).to.equal(modified);
		expect(dataFrame.getColumnNames()).to.eql(columnNames);
	});

});
