'use strict';


describe('BaseDataFrame', function () {
	
	var panjas = require('../index');	
	var BaseDataFrame = require('../src/basedataframe');
	
	var expect = require('chai').expect;
	var assert = require('chai').assert;

	var initDataFrame = function (columns, values, index) {
		assert.isArray(columns);
		assert.isArray(values);
		assert.isArray(index);

		var dataFrame = new BaseDataFrame();
		dataFrame.getColumnNames = function () {
			return columns; 
		};
		dataFrame.getValues = function () {
			return values;
		};
		dataFrame.getIndex = function () {
			return new panjas.Index(index);
		};
		return dataFrame;
	};
	
	it('throws expection when pulling a non-existing column name', function () {
		
		expect(function () {
			var dataFrame = initDataFrame(
				[ "Date", "Value1", "Value2", "Value3" ],
				[
					[new Date(1975, 24, 2), 100, 'foo', 11],
					[new Date(2015, 24, 2), 200, 'bar', 22],
				],
				[5, 6]
			);
			dataFrame.getColumn('non-existing column name');			
		}).to.throw(Error).with.property('message').that.equals("In call to 'getColumn' failed to find column 'non-existing column name'.");
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
		var column1 = dataFrame.getColumn('Value1');
		expect(column1.getIndex().getValues()).to.eql([5, 6]);
		expect(column1.getValues()).to.eql([100, 200]);
		
		var column2 = dataFrame.getColumn('Value2');
		expect(column2.getIndex().getValues()).to.eql([5, 6]);
		expect(column2.getValues()).to.eql(['foo', 'bar']);
		
		var column3 = dataFrame.getColumn('Value3');
		expect(column3.getIndex().getValues()).to.eql([5, 6]);
		expect(column3.getValues()).to.eql([11, 22]);
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
		var column1 = dataFrame.getColumn(1);
		expect(column1.getIndex().getValues()).to.eql([5, 6]);
		expect(column1.getValues()).to.eql([100, 200]);
		
		var column2 = dataFrame.getColumn(2);
		expect(column2.getIndex().getValues()).to.eql([5, 6]);
		expect(column2.getValues()).to.eql(['foo', 'bar']);
		
		var column3 = dataFrame.getColumn(3);
		expect(column3.getIndex().getValues()).to.eql([5, 6]);
		expect(column3.getValues()).to.eql([11, 22]);
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
		expect(columns[0].getValues()).to.eql([new Date(1975, 24, 2), new Date(2015, 24, 2)]);

		expect(columns[2].getName()).to.eql('Value2');
		expect(columns[2].getValues()).to.eql(['foo', 'bar']);
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
		expect(subset.getIndex().getValues()).to.eql([5, 6]);
		expect(subset.getValues()).to.eql([
			[11, 100],
			[22, 200],
		]);
	});
	
	it('can output data frame', function () {
		
		var dataFrame = initDataFrame(
			[ "Date", "Value1", "Value2", "Value3" ],
			[
				[new Date(1975, 24, 2), 100, 'foo', 11],
				[new Date(2015, 24, 2), 200, 'bar', 22],
			],
			[5, 6]
		);
		var dataSourceOptions = {};
		var formatOptions = {};
		var formattedText = "some-text";
		var promise = {};

		var dataFormatPlugin = function (options) {			
			expect(options).to.equal(formatOptions);

			return {
				to: function (outputDataFrame) {
					expect(outputDataFrame).to.equal(dataFrame);
					return formattedText;				
				},
			};
		};
		
		var dataSourcePlugin = function (options) {
			expect(options).to.equal(options);

			return {
				write: function (textData, options) {
					expect(textData).to.equal(formattedText);					
					return promise;				
				},
			};
		};
		
		var result = dataFrame
			.as(dataFormatPlugin(formatOptions))
			.to(dataSourcePlugin(dataSourceOptions));
		expect(result).to.equal(promise);
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
		expect(sorted.getIndex().getValues()).to.eql([7, 8, 6, 5]);
		expect(sorted.getValues()).to.eql([
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
		expect(sorted.getIndex().getValues()).to.eql([6, 7, 5, 8]);
		expect(sorted.getValues()).to.eql([
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
		expect(sorted.getIndex().getValues()).to.eql([6, 7, 5, 8]);
		expect(sorted.getValues()).to.eql([
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
		expect(sorted.getIndex().getValues()).to.eql([7, 8, 5, 6]);
		expect(sorted.getValues()).to.eql([
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
		expect(sorted.getIndex().getValues()).to.eql([8, 7, 5, 6]);
		expect(sorted.getValues()).to.eql([
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
		expect(sorted.getIndex().getValues()).to.eql([8, 7, 5, 6]);
		expect(sorted.getValues()).to.eql([
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
		expect(sorted.getIndex().getValues()).to.eql([6, 7, 5, 8]);
		expect(sorted.getValues()).to.eql([
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
		expect(sorted.getIndex().getValues()).to.eql([8, 5, 7, 6]);
		expect(sorted.getValues()).to.eql([
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
		expect(sorted.getIndex().getValues()).to.eql([6, 7, 5, 8]);
		expect(sorted.getValues()).to.eql([
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
		expect(sorted.getIndex().getValues()).to.eql([8, 5, 7, 6]);
		expect(sorted.getValues()).to.eql([
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
		expect(modified.getIndex().getValues()).to.eql([5, 6, 7, 8]);
		expect(modified.getValues()).to.eql([
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
		expect(modified.getIndex().getValues()).to.eql([5, 6, 7, 8]);
		expect(modified.getValues()).to.eql([
			[300, 3],
			[200, 1],
			[20, 22],
			[100, 4],
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
		var modified = dataFrame.setColumn('Value4', [1, 2, 3, 4]);
		expect(modified.getIndex().getValues()).to.eql([5, 6, 7, 8]);
		expect(modified.getColumnNames()).to.eql([
			"Date",
			"Value1",
			"Value2",
			"Value3",
			"Value4",
		]);
		expect(modified.getValues()).to.eql([
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
		var modified = dataFrame.setColumn('Value1', [1, 2, 3, 4]);
		expect(modified.getIndex().getValues()).to.eql([5, 6, 7, 8]);
		expect(modified.getValues()).to.eql([
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
		var modified = dataFrame2.setColumn('Value4', dataFrame1.getColumn('Value2'));
		expect(modified.getColumnNames()).to.eql([
			"Date",
			"Value1",
			"Value2",
			"Value3",
			"Value4",
		]);
		expect(modified.getValues()).to.eql([
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
		var newColumn = new panjas.Column(newColumnName, [4, 3, 2, 1], new panjas.Index([0, 5, 2, 7]))
		var modified = dataFrame.setColumn(newColumnName, newColumn);
		var mergedColumn = modified.getColumn(newColumnName);

		expect(modified.getIndex().getValues()).to.eql([5, 6, 7, 8]);
		expect(modified.getColumnNames()).to.eql([
			"Date",
			"Value1",
			"Value2",
			"Value3",
			newColumnName,
		]);
		expect(modified.getValues()).to.eql([
			[new Date(2011, 24, 2), 300, 'c', 3, 3],
			[new Date(1975, 24, 2), 200, 'b', 1, undefined],
			[new Date(2013, 24, 2), 20, 'c', 22, 1],
			[new Date(2015, 24, 2), 100, 'd', 4, undefined],
		]);

		expect(mergedColumn.getIndex().getValues()).to.eql([5, 6, 7, 8]);
		expect(mergedColumn.getValues()).to.eql([3, undefined, 1, undefined]);
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
		var subset = dataFrame.getRowsSubset(1, 2);
		expect(subset.getIndex().getValues()).to.eql([6, 7]);
		expect(subset.getValues()).to.eql([
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

		expect(indexedDataFrame.getIndex().getValues()).to.eql([
			new Date(1975, 24, 2),
			new Date(2015, 24, 2)
		]);

		expect(indexedDataFrame.getValues()).to.eql([
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

		expect(indexedDataFrame.getIndex().getValues()).to.eql([
			new Date(1975, 24, 2),
			new Date(2015, 24, 2)
		]);

		expect(indexedDataFrame.getValues()).to.eql([
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

		expect(dataFrameWithIndexReset.getIndex().getValues()).to.eql([
			0,
			1
		]);

		expect(dataFrameWithIndexReset.getValues()).to.eql([
			[new Date(1975, 24, 2), 100, 'foo', 11],
			[new Date(2015, 24, 2), 200, 'bar', 22],
		]);
	});
});
