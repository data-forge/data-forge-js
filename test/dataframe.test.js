'use strict';


describe('DataFrame', function () {
	
	var dataForge = require('../index');	
	var DataFrame = require('../src/dataframe');
	var Series = require('../src/series');
	var ArrayIterator = require('../src/iterators/array');
	var moment = require('moment');
	var extend = require('extend');
		
	var expect = require('chai').expect;
	var assert = require('chai').assert;
	var E = require('linq');

	var initDataFrame = function (columns, values, index) {
		assert.isArray(columns);
		assert.isArray(values);
		
		var config = {
			columnNames: columns,
			values: values,			
		};

		if (index) {
			config.index = index;
		}

		return new DataFrame(config);
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

	it('can extract values', function () {

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
		expect(dataFrame.toRows()).to.eql([
			[new Date(2011, 24, 2), 300, 'c', 3],
			[new Date(1975, 24, 2), 200, 'b', 1],
			[new Date(2013, 24, 2), 20, 'c', 22],
			[new Date(2015, 24, 2), 100, 'd', 4],
		]);
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
		expect(series1.getIndex().take(2).toArray()).to.eql([5, 6]);
		expect(series1.toArray()).to.eql([100, 200]);
		
		var series2 = dataFrame.getSeries('Value2');
		expect(series2.getIndex().take(2).toArray()).to.eql([5, 6]);
		expect(series2.toArray()).to.eql(['foo', 'bar']);
		
		var series3 = dataFrame.getSeries('Value3');
		expect(series3.getIndex().take(2).toArray()).to.eql([5, 6]);
		expect(series3.toArray()).to.eql([11, 22]);
	});

	it('when a series is extracted from a dataframe, undefined values are stripped out.', function () {
		
		var dataFrame = initDataFrame(
			[ "S" ],
			[
				[undefined],
				[11],
				[undefined],
				[12],
				[undefined],
			]
		);
		
		var series = dataFrame.getSeries('S');
		expect(series.toPairs()).to.eql([
			[1, 11],
			[3, 12],
		]);
	});

	it('retreive a non-existing column results in an empty series', function () {

		var dataFrame = new DataFrame({
			columnNames: ["C1"],
			values: [
				[1]
			],
		});

		var series = dataFrame.getSeries("non-existing-column");
		expect(series.toPairs()).to.eql([]);
	});

	it('can ensure series that doesnt exist', function () {

		var dataFrame = new DataFrame({
			columnNames: ["C1"],
			values: [
				[1],
				[2],
			],
		});

		console.log(dataFrame.toArray());

		var modified = dataFrame.ensureSeries("C2", new Series({ values: [10, 20] }));

		expect(modified.getColumnNames()).to.eql(["C1", "C2"]);
		expect(modified.toRows()).to.eql([
			[1, 10],
			[2, 20],
		]);
	});

	it('can ensure series that already exists', function () {

		var dataFrame = new DataFrame({
			columnNames: ["C1", "C2"],
			values: [
				[1, 52],
				[2, 53],
			],
		});

		var modified = dataFrame.ensureSeries("C2", new Series({ values: [100, 200] }));

		expect(modified.getColumnNames()).to.eql(["C1", "C2"]);
		expect(modified.toRows()).to.eql([
			[1, 52],
			[2, 53],
		]);
	});

	it('can ensure series that doesnt exist - with series generator function', function () {

		var dataFrame = new DataFrame({
			columnNames: ["C1"],
			values: [
				[1],
				[2],
			],
		});

		console.log(dataFrame.toArray());

		var modified = dataFrame.ensureSeries("C2", df => new Series({ values: [10, 20] }));

		expect(modified.getColumnNames()).to.eql(["C1", "C2"]);
		expect(modified.toRows()).to.eql([
			[1, 10],
			[2, 20],
		]);
	});

	it('can ensure series that already exists - with series generator function', function () {

		var dataFrame = new DataFrame({
			columnNames: ["C1", "C2"],
			values: [
				[1, 52],
				[2, 53],
			],
		});

		var modified = dataFrame.ensureSeries("C2", df => new Series({ values: [100, 200] }));

		expect(modified.getColumnNames()).to.eql(["C1", "C2"]);
		expect(modified.toRows()).to.eql([
			[1, 52],
			[2, 53],
		]);
	});

	it('can ensure series that doesnt exist - with column spec', function () {

		var dataFrame = new DataFrame({
			columnNames: ["C1"],
			values: [
				[1],
				[2],
			],
		});

		console.log(dataFrame.toArray());

		var modified = dataFrame.ensureSeries({ C2: new Series({ values: [10, 20] }) });

		expect(modified.getColumnNames()).to.eql(["C1", "C2"]);
		expect(modified.toRows()).to.eql([
			[1, 10],
			[2, 20],
		]);
	});

	it('can ensure series that already exists - with column spec', function () {

		var dataFrame = new DataFrame({
			columnNames: ["C1", "C2"],
			values: [
				[1, 52],
				[2, 53],
			],
		});

		var modified = dataFrame.ensureSeries({ C2: new Series({ values: [100, 200] }) });

		expect(modified.getColumnNames()).to.eql(["C1", "C2"]);
		expect(modified.toRows()).to.eql([
			[1, 52],
			[2, 53],
		]);
	});

	it('can ensure series that doesnt exist - with column spec and series generator fn', function () {

		var dataFrame = new DataFrame({
			columnNames: ["C1"],
			values: [
				[1],
				[2],
			],
		});

		console.log(dataFrame.toArray());

		var modified = dataFrame.ensureSeries({ C2: df => new Series({ values: [10, 20] }) });

		expect(modified.getColumnNames()).to.eql(["C1", "C2"]);
		expect(modified.toRows()).to.eql([
			[1, 10],
			[2, 20],
		]);
	});

	it('can ensure series that already exists - with column spec and series generator fn', function () {

		var dataFrame = new DataFrame({
			columnNames: ["C1", "C2"],
			values: [
				[1, 52],
				[2, 53],
			],
		});

		var modified = dataFrame.ensureSeries({ C2: df => new Series({ values: [100, 200] }) });

		expect(modified.getColumnNames()).to.eql(["C1", "C2"]);
		expect(modified.toRows()).to.eql([
			[1, 52],
			[2, 53],
		]);
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
		expect(columns.count()).to.eql(4);

		expect(columns.at(0).name).to.eql('Date');
		expect(columns.at(0).series.toArray()).to.eql([new Date(1975, 24, 2), new Date(2015, 24, 2)]);

		expect(columns.at(2).name).to.eql('Value2');
		expect(columns.at(2).series.toArray()).to.eql(['foo', 'bar']);
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
		var subset = dataFrame.subset(['Value3', 'Value1']);
		expect(dataFrame).not.to.equal(subset); 
		expect(subset.getIndex().toArray()).to.eql([5, 6]);
		expect(subset.toRows()).to.eql([
			[11, 100],
			[22, 200],
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
		var modified = dataFrame.dropSeries('Date');
		expect(modified.getIndex().toArray()).to.eql([5, 6, 7, 8]);
		expect(modified.toRows()).to.eql([
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
        var modified = dataFrame.dropSeries(['Date', 'Value2'])
		expect(modified.getIndex().toArray()).to.eql([5, 6, 7, 8]);
		expect(modified.toRows()).to.eql([
			[300, 3],
			[200, 1],
			[20, 22],
			[100, 4],
        ]);
		expect(modified.toArray()).to.eql([
            {
                Value1: 300,
                Value3: 3,
            },
            {
                Value1: 200,
                Value3: 1,
            },
            {
                Value1: 20,
                Value3: 22,
            },
            {
                Value1: 100,
                Value3: 4,
            },
		]);
	});

	it('can keep column', function () {
		
		var dataFrame = initDataFrame(
			[ "Value1", "Value2", "Value3" ],
			[
				[300, 'c', 3],
				[200, 'b', 1],
				[20, 'c', 22],
				[100, 'd', 4],
			],
			[5, 6, 7, 8]
		);
		var modified = dataFrame.subset(['Value1']);
		expect(modified.getColumnNames()).to.eql(['Value1']);
		expect(modified.getIndex().toArray()).to.eql([5, 6, 7, 8]);
		expect(modified.toRows()).to.eql([
			[300],
			[200],
			[20],
			[100],
		]);
	});

	it('can keep multiple columns', function () {
		
		var dataFrame = initDataFrame(
			[ "Value1", "Value2", "Value3" ],
			[
				[300, 'c', 3],
				[200, 'b', 1],
				[20, 'c', 22],
				[100, 'd', 4],
			],
			[5, 6, 7, 8]
		);

		var modified = dataFrame.subset(['Value1', 'Value3']);
		expect(modified.getColumnNames()).to.eql(['Value1', 'Value3']);
		expect(modified.getIndex().toArray()).to.eql([5, 6, 7, 8]);
		expect(modified.toRows()).to.eql([
			[300, 3],
			[200, 1],
			[20, 22],
			[100, 4],
        ]);
		expect(modified.toArray()).to.eql([
            {
                Value1: 300,
                Value3: 3,
            },
            {
                Value1: 200,
                Value3: 1,
            },
            {
                Value1: 20,
                Value3: 22,
            },
            {
                Value1: 100,
                Value3: 4,
            },
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
		var modified = dataFrame.dropSeries('non-existing-column');
		expect(modified.getIndex().toArray()).to.eql([5, 6, 7, 8]);
		expect(modified.getColumnNames()).to.eql(columnNames);
		expect(modified.toRows()).to.eql([
				[new Date(2011, 24, 2), 300, 'c', 3],
				[new Date(1975, 24, 2), 200, 'b', 1],
				[new Date(2013, 24, 2), 20, 'c', 22],
				[new Date(2015, 24, 2), 100, 'd', 4],
		]);
	});

	it('can set new series', function () {
		
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
		var series = new dataForge.Series({ index: [5, 6, 7, 8], values: [1, 2, 3, 4] });
		var modified = dataFrame.withSeries('Value4', series);
		expect(modified.getIndex().toArray()).to.eql([5, 6, 7, 8]);
		expect(modified.getColumnNames()).to.eql([
			"Date",
			"Value1",
			"Value2",
			"Value3",
			"Value4",
		]);
		expect(modified.toRows()).to.eql([
			[new Date(2011, 24, 2), 300, 'c', 3, 1],
			[new Date(1975, 24, 2), 200, 'b', 1, 2],
			[new Date(2013, 24, 2), 20, 'c', 22, 3],
			[new Date(2015, 24, 2), 100, 'd', 4, 4],
		]);
	});

	it('can set existing series', function () {
		
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
		var series = new dataForge.Series({ index: [5, 6, 7, 8], values: [1, 2, 3, 4] });
		var modified = dataFrame.withSeries('Value1', series);
		expect(modified.getIndex().toArray()).to.eql([5, 6, 7, 8]);
		expect(modified.toRows()).to.eql([
			[new Date(2011, 24, 2), 1, 'c', 3],
			[new Date(1975, 24, 2), 2, 'b', 1],
			[new Date(2013, 24, 2), 3, 'c', 22],
			[new Date(2015, 24, 2), 4, 'd', 4],		
		]);
	});

	it('can set series from another data frame', function () {
		
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
		var modified = dataFrame2.withSeries('Value4', dataFrame1.getSeries('Value2'));
		expect(modified.getColumnNames()).to.eql([
			"Date",
			"Value1",
			"Value2",
			"Value3",
			"Value4",
		]);
		expect(modified.toRows()).to.eql([
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
		var newIndex = [0, 5, 2, 7];
		var newSeries = new dataForge.Series({ values: [4, 3, 2, 1], index: newIndex });
		var modified = dataFrame.withSeries(newColumnName, newSeries);
		var mergedSeries = modified.getSeries(newColumnName);

		expect(modified.getIndex().take(4).toArray()).to.eql([5, 6, 7, 8]);
		expect(modified.getColumnNames()).to.eql([
			"Date",
			"Value1",
			"Value2",
			"Value3",
			newColumnName,
		]);
		expect(modified.toRows()).to.eql([
			[new Date(2011, 24, 2), 300, 'c', 3, 3],
			[new Date(1975, 24, 2), 200, 'b', 1, undefined],
			[new Date(2013, 24, 2), 20, 'c', 22, 1],
			[new Date(2015, 24, 2), 100, 'd', 4, undefined],
		]);

		expect(mergedSeries.getIndex().take(4).toArray()).to.eql([5, 6, 7, 8]);
		expect(mergedSeries.toArray()).to.eql([3, 1]);
	});

	it('can set series on empty dataframe', function () {

		var dataFrame = new dataForge.DataFrame();
		var withSeries = dataFrame.withSeries("NewSeries", new dataForge.Series({ values: [1, 2, 3] }))

		expect(withSeries.getColumnNames()).to.eql(["NewSeries"]);
		expect(withSeries.toRows()).to.eql([
			[1],
			[2],
			[3],
		]);
	});

	it('can set new series', function () {

		var dataFrame = new dataForge.DataFrame({
				columnNames: ["A"],
				values: [[1], [2], [3]],
			});
		var withSeries = dataFrame.withSeries("B", new Series({ values: [10, 20, 30]}));

		expect(withSeries.getColumnNames()).to.eql(["A", "B"]);
		expect(withSeries.toRows()).to.eql([
			[1, 10],
			[2, 20],
			[3, 30],
		]);
	});

	it('can generate new series', function () {

		var dataFrame = new dataForge.DataFrame({
				columnNames: ["A"],
				values: [[1], [2], [3]],
			});
		var withSeries = dataFrame
			.withSeries("B", function (df) {
				return new Series({ values: [10, 20, 30]});				
			});

		expect(withSeries.getColumnNames()).to.eql(["A", "B"]);
		expect(withSeries.toRows()).to.eql([
			[1, 10],
			[2, 20],
			[3, 30],
		]);
	});

	it('can transform existing series', function () {

		var dataFrame = new dataForge.DataFrame({
				columnNames: ["A"],
				values: [[1], [2], [3]],
			});
		var withSeries = dataFrame
			.withSeries("B", function (df) {
				return df
					.getSeries("A")
					.select(v => v * 10)
					; 
			});

		expect(withSeries.getColumnNames()).to.eql(["A", "B"]);
		expect(withSeries.toRows()).to.eql([
			[1, 10],
			[2, 20],
			[3, 30],
		]);
	});

	it('can set new series - using column spec', function () {

		var dataFrame = new dataForge.DataFrame({
				columnNames: ["A"],
				values: [[1], [2], [3]],
			});
		var withSeries = dataFrame
			.withSeries({ 
				B: new Series({ values: [10, 20, 30] }), 
			});

		expect(withSeries.getColumnNames()).to.eql(["A", "B"]);
		expect(withSeries.toRows()).to.eql([
			[1, 10],
			[2, 20],
			[3, 30],
		]);
	});

	it('can generate new series - using column spec', function () {

		var dataFrame = new dataForge.DataFrame({
				columnNames: ["A"],
				values: [[1], [2], [3]],
			});
		var withSeries = dataFrame
			.withSeries({
				B: function (df) {
					return new Series({ values: [10, 20, 30]});				
				}
			});

		expect(withSeries.getColumnNames()).to.eql(["A", "B"]);
		expect(withSeries.toRows()).to.eql([
			[1, 10],
			[2, 20],
			[3, 30],
		]);
	});

	it('can transform existing series - using column spec', function () {

		var dataFrame = new dataForge.DataFrame({
				columnNames: ["A"],
				values: [[1], [2], [3]],
			});
		var withSeries = dataFrame
			.withSeries({
				B: function (df) {
					return df
						.getSeries("A")
						.select(v => v * 10)
						; 
				},
			});

		expect(withSeries.getColumnNames()).to.eql(["A", "B"]);
		expect(withSeries.toRows()).to.eql([
			[1, 10],
			[2, 20],
			[3, 30],
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

		expect(indexedDataFrame.getIndex().toArray()).to.eql([
			new Date(1975, 24, 2),
			new Date(2015, 24, 2)
		]);

		expect(indexedDataFrame.toRows()).to.eql([
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
		expect(detectedTypes.getIndex().take(3).toArray()).to.eql([0, 1, 2]);
		expect(detectedTypes.take(3).toRows()).to.eql([
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
		expect(detectedTypes.getIndex().toArray()).to.eql([0, 1, 2]);
		expect(detectedTypes.toRows()).to.eql([
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
		expect(truncated.toRows()).to.eql([
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

		var remapped = dataFrame.reorderSeries(["Col2", "Col1"]);

		expect(remapped.getColumnNames()).to.eql([ "Col2", "Col1" ]);
		expect(remapped.toRows()).to.eql([
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

		var remapped = dataFrame.reorderSeries(["Col2"]);

		expect(remapped.getColumnNames()).to.eql([ "Col2" ]);
		expect(remapped.toRows()).to.eql([
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

		var remapped = dataFrame.reorderSeries(["New Column", "Col2"]);

		expect(remapped.getColumnNames()).to.eql([ "New Column", "Col2" ]);
		expect(remapped.toRows()).to.eql([
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
		var renamed = dataFrame.renameSeries(newColumnNames);
		expect(renamed.getColumnNames()).to.eql(newColumnNames);
		var columns = renamed.getColumns();
		expect(columns.count()).to.eql(3);
		expect(columns.at(0).series.toArray()).to.eql([300, 200]);
		expect(columns.at(1).series.toArray()).to.eql(['c', 'b']);
		expect(columns.at(2).series.toArray()).to.eql([3, 1]);
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

		expect(dataFrame.toArray()).to.eql([
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

	it('can rename column', function () {

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
		var columnDef = {};
		columnDef[oldColumnName] = newColumnName;
		var renamed = dataFrame.renameSeries(columnDef);

		expect(dataFrame.getColumnNames()[1]).to.eql(oldColumnName);

		expect(renamed.getColumnNames()[1]).to.eql(newColumnName);
		expect(renamed.getSeries(newColumnName)).to.be.ok;
	});

	it('renaming non-existing column has no effect', function () {

		var columnNames = ["Column1", "Column2"];
		var dataFrame = initDataFrame(
				columnNames, 
				[
					['A', 1],
					['B', 2],
				],
				[10, 11]
			);

		var columnDef = {};
		columnDef["some-column-that-doesnt-exist"] = "new-column-name";
		var renamed = dataFrame.renameSeries(columnDef);

		expect(dataFrame.getColumnNames()).to.eql(columnNames);
		expect(dataFrame.getIndex().toArray()).to.eql([10, 11]);
		expect(dataFrame.toRows()).to.eql([
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

	it('can transform column', function () {

		var dataFrame = initDataFrame(
				["Column1", "Column2"], 
				[
					['A', 1],
					['B', 2],
				],
				[10, 11]
			);
		var modified = dataFrame.transformSeries({
				Column2: function (value) {
					return value + 100;
				}
			});
		expect(dataFrame.getSeries("Column2").toArray()).to.eql([1, 2]);
		expect(modified.getSeries("Column2").toArray()).to.eql([101, 102]);
	});

	it('can transform multiple columns', function () {

		var dataFrame = initDataFrame(
				["Column1", "Column2"], 
				[
					['A', 1],
					['B', 2],
				],
				[10, 11]
			);
		var modified = dataFrame.transformSeries({
				Column2: function (value) {
					return value + 100;
				},
				Column1: function (value) {
					return value + value;
				},
			});
		expect(dataFrame.getSeries("Column1").toArray()).to.eql(['A', 'B']);
		expect(dataFrame.getSeries("Column2").toArray()).to.eql([1, 2]);
		expect(modified.getSeries("Column1").toArray()).to.eql(['AA', 'BB']);
		expect(modified.getSeries("Column2").toArray()).to.eql([101, 102]);
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
		var modified = dataFrame.transformSeries({
				"non-existing-column": function (value) {
					return value + 100;
				},
			});
		expect(dataFrame).to.equal(modified);
        expect(dataFrame.getColumnNames()).to.eql(columnNames);
        expect(dataFrame.toArray()).to.eql([
            {
                Column1: 'A',
                Column2: 1,
            },
            {
                Column1: 'B',
                Column2: 2,
            },
        ]);
	});

	it('transforming a normal column and a non-existing column has no additional effect', function () {

		var columnNames = ["Column1", "Column2"];
		var dataFrame = initDataFrame(
				columnNames, 
				[
					['A', 1],
					['B', 2],
				],
				[10, 11]
			);
		var modified = dataFrame.transformSeries({
                Column2: v => v + 5,
				"non-existing-column": function (value) {
					return value + 100;
				},
			});
        expect(modified.toArray()).to.eql([
            {
                Column1: 'A',
                Column2: 6,
            },
            {
                Column1: 'B',
                Column2: 7,
            },
        ]);
	});
    
	//
	// Generate a data frame for testing.
	//
	var genDataFrame = function (numColumns, numRows) {

		var columnNames = E.range(0, numColumns)
			.select(function (columnIndex) {
				return columnIndex.toString();
			})
			.toArray();
		var rows = E.range(0, numRows)
			.select(function (rowIndex) {
				return E.range(0, numColumns)
					.select(function (columnIndex) {
						return (rowIndex+1) * (columnIndex+1);
					})
					.toArray();
			})
			.toArray();
		var index = E.range(0, numRows)
			.toArray();

		return initDataFrame(columnNames, rows, index);
	};

	it('can generate series - function version', function () {

		var initialColumns = ["Column1", "Column2"];
		var dataFrame = initDataFrame(
				initialColumns, 
				[
					[1, 10],
					[2, 20],
					[3, 30],
				],
				[10, 11, 12]
			);

		var modified = dataFrame.generateSeries(function (row) {
				return {
					NewColumn: row.Column1 + row.Column2,
				};
			});

		var newColumnName = "NewColumn";
		var newColumnNames = initialColumns.concat([newColumnName]);

		expect(dataFrame.getColumnNames()).to.eql(initialColumns);
		expect(modified.getColumnNames()).to.eql(newColumnNames);
		expect(modified.getSeries(newColumnName).toArray()).to.eql([11, 22, 33]);
	});

	it('can generate series - object version', function () {

		var initialColumns = ["Column1", "Column2"];
		var dataFrame = initDataFrame(
				initialColumns, 
				[
					[1, 10],
					[2, 20],
					[3, 30],
				],
				[10, 11, 12]
			);

		var modified = dataFrame.generateSeries({
				NewColumn: function (row) {
					return row.Column1 + row.Column2;
				},
			});
			
		var newColumnName = "NewColumn";
		var newColumnNames = initialColumns.concat([newColumnName]);

		expect(dataFrame.getColumnNames()).to.eql(initialColumns);
		expect(modified.getColumnNames()).to.eql(newColumnNames);
		expect(modified.getSeries(newColumnName).toArray()).to.eql([11, 22, 33]);
	});

	it('can deflate dataframe to series', function () {

		var dataFrame = initDataFrame(
				["Column1", "Column2"], 
				[
					[1, 10],
					[2, 20],
					[3, 30],
				],
				[10, 11, 12]
			);

		var series = dataFrame.deflate(function (row) {
				return row.Column1 + row.Column2;
			});

		expect(series.toArray()).to.eql([11, 22, 33]);
	});

	it('can aggregate dataframe', function () {

		var dataFrame = initDataFrame(
				["Column1", "Column2"], 
				[
					[1, 10],
					[2, 20],
					[3, 30],
				],
				[10, 11, 12]
			);

		var agg = dataFrame.aggregate({ Column1: 0, Column2: 1 }, function (prev, value) {
				return {
					Column1: prev.Column1 + value.Column1,
					Column2: prev.Column2 * value.Column2,
				};
			});

		expect(agg.Column1).to.eql(6);
		expect(agg.Column2).to.eql(6000);
	});

	it('can aggregate dataframe with no seed', function () {

		var dataFrame = initDataFrame(
				["Column1", "Column2"], 
				[
					[1, 10],
					[2, 20],
					[3, 30],
				],
				[10, 11, 12]
			);

		var agg = dataFrame.aggregate(function (prev, value) {
				return {
					Column1: prev.Column1 + value.Column1,
					Column2: prev.Column2 * value.Column2,
				};
			});

		expect(agg.Column1).to.eql(6);
		expect(agg.Column2).to.eql(6000);
	});

	it('can aggregate dataframe with seed', function () {

		var dataFrame = initDataFrame(
				["Column1", "Column2"], 
				[
					[1, 10],
					[2, 20],
					[3, 30],
				],
				[10, 11, 12]
			);

		var agg = dataFrame.aggregate({ Column1: 0, Column2: 1 }, function (prev, value) {
				return {
					Column1: prev.Column1 + value.Column1,
					Column2: prev.Column2 * value.Column2,
				};
			});

		expect(agg.Column1).to.eql(6);
		expect(agg.Column2).to.eql(6000);
	});

	it('can aggregate dataframe with function as seed', function () {

		var dataFrame = initDataFrame(
				["Column1", "Column2"], 
				[
					[1, 10],
					[2, 20],
					[3, 30],
				],
				[10, 11, 12]
			);

		var agg = dataFrame.aggregate(
			function () {
				return { Column1: 0, Column2: 1 };
			},			
			function (prev, value) {
				return function () {
					return {
						Column1: prev().Column1 + value.Column1,
						Column2: prev().Column2 * value.Column2,
					};
				};
			}
		);

		expect(agg().Column1).to.eql(6);
		expect(agg().Column2).to.eql(6000);
	});

	it('can aggregate dataframe with separate functions per column', function () {

		var dataFrame = initDataFrame(
				["Column1", "Column2"], 
				[
					[1, 10],
					[2, 20],
					[3, 30],
				],
				[10, 11, 12]
			);

		var agg = dataFrame.aggregate({ 
				Column1: function (prev, value)  {
					return prev + value;
				},
				Column2: function (prev, value) {
					return prev * value;
				},
			});

		expect(agg.Column1).to.eql(6);
		expect(agg.Column2).to.eql(6000);
	});

	it('can get columns', function () {

		var columns = ["Date", "Value1", "Value2","Value3" ];	
		var dataFrame = new dataForge.DataFrame({ columnNames: columns, values: [] });
		expect(dataFrame.getColumnNames()).to.eql(columns);
	});

	it('can get rows', function () {
		
		var columns = ["Date", "Value1", "Value2","Value3" ];	
		var rows = [
			[new Date(1975, 24, 2), 100, 'foo', 11],
			[new Date(2015, 24, 2), 200, 'bar', 22],
		];
		var dataFrame = new dataForge.DataFrame({ columnNames: columns, values: rows });
		expect(dataFrame.toRows()).to.eql(rows);
	});

	it('can specify rows as an iterable of arrays', function () {

		var columns = ["Date", "Value1", "Value2","Value3" ];	
		var rows = [
			[new Date(1975, 24, 2), 100, 'foo', 11],
			[new Date(2015, 24, 2), 200, 'bar', 22],
		];
		var iterable = function ()  {
			return new ArrayIterator(rows);
		};
		var dataFrame = new dataForge.DataFrame({ columnNames: columns, values: iterable });
		expect(dataFrame.toRows()).to.eql(rows);
	});

	it('can specify rows as an iterable of objects', function () {

		var rows = [
			{
				V1: 1,
				V2: 10,
			},
			{
				V1: 2,
				V2: 100,
			},
		];
		var iterable = function ()  {
			return new ArrayIterator(rows);
		};
		var dataFrame = new dataForge.DataFrame({ values: iterable });
		expect(dataFrame.getColumnNames()).to.eql(["V1", "V2"]);
		expect(dataFrame.getSeries("V1").toArray()).to.eql([1, 2]);
		expect(dataFrame.getSeries("V2").toArray()).to.eql([10, 100]);
	});

	it('default index is generated', function () {

		var columns = ["Date", "Value1", "Value2","Value3" ];	
		var rows = [
			[new Date(1975, 24, 2), 100, 'foo', 11],
			[new Date(2015, 24, 2), 200, 'bar', 22],
		];
		var dataFrame = new dataForge.DataFrame({ columnNames: columns, values: rows });
		expect(dataFrame.getIndex().take(2).toArray()).to.eql([0, 1 ]);
	});

	it('there are no rows or columns when no columns or rows are specified', function () {
		
		var dataFrame = new dataForge.DataFrame();
		expect(dataFrame.getColumnNames()).to.eql([]);
		expect(dataFrame.getColumns().count()).to.eql(0);
		expect(dataFrame.toRows()).to.eql([]);
	})

	it('there are no rows or columns when no columns or rows are specified', function () {
		
		var dataFrame = new dataForge.DataFrame({});
		expect(dataFrame.getColumnNames()).to.eql([]);
		expect(dataFrame.getColumns().count()).to.eql(0);
		expect(dataFrame.toRows()).to.eql([]);
	})

	it('can initialize from array of objects', function () {

		var dataFrame = new dataForge.DataFrame({
				values: [
					{
						Col1: 1,
						Col2: 'hello',
					},
					{
						Col2: 'computer',
						Col1: 10,
					}
				]
			});
		
		expect(dataFrame.getColumnNames()).to.eql(["Col1", "Col2"]);
		expect(dataFrame.toRows()).to.eql([
			[1, 'hello'],
			[10, 'computer'],
		])
		
		var columns = dataFrame.getColumns();
		expect(columns.count()).to.eql(2);

		expect(columns.at(0).name).to.eql("Col1");
		expect(columns.at(0).series.toArray()).to.eql([1, 10]);

		expect(columns.at(1).name).to.eql("Col2");
		expect(columns.at(1).series.toArray()).to.eql(["hello", "computer"]);
	});

	/*todo: Would like to enable this feature again one day.

	it('can initialize from array of objects with different fields', function () {

		var dataFrame = new dataForge.DataFrame({
				values: [
					{
						Col1: 1,
						Col2: 'hello',
					},
					{
						Col3: 10,
						Col4: 'computer',
					}
				]
			});

		expect(dataFrame.getColumnNames()).to.eql(["Col1", "Col2", "Col3", "Col4"]);

		expect(dataFrame.toRows()).to.eql([
			[1, 'hello', undefined, undefined],
			[undefined, undefined, 10, 'computer'],
		]);
		
		var columns = dataFrame.getColumns();
		expect(columns.count()).to.eql(4);

		expect(columns.at(0).name).to.eql("Col1");
		expect(columns.at(0).series.toArray()).to.eql([1]);

		expect(columns.at(1).name).to.eql("Col2");
		expect(columns.at(1).series.toArray()).to.eql(["hello"]);

		expect(columns.at(2).name).to.eql("Col3");
		expect(columns.at(2).series.toArray()).to.eql([10]);

		expect(columns.at(3).name).to.eql("Col4");
		expect(columns.at(3).series.toArray()).to.eql(["computer"]);
	});
	*/	

	it('can initialize from array of objects with zero fields', function () {

		var dataFrame = new dataForge.DataFrame({
				values: [
					{},
					{}
				]
			});

		expect(dataFrame.getColumnNames()).to.eql([]);
		expect(dataFrame.getColumns().count()).to.eql(0);
		expect(dataFrame.toRows()).to.eql([[], []]);
	});	

	it('can bring column to front', function () {

		var dataFrame = initDataFrame(["a", "b", "c"], [[1, 2, 3], [4, 5, 6]]);

		expect(dataFrame.getColumnNames()).to.eql(["a", "b", "c"]);

		var modified = dataFrame.bringToFront("b");

		expect(modified.getColumnNames()).to.eql(["b", "a", "c"]);
		expect(modified.toRows()).to.eql([
			[2, 1, 3],
			[5, 4, 6],
		]);
	});

	it('can bring multiple columns to front', function () {

		var dataFrame = initDataFrame(["a", "b", "c"], [[1, 2, 3], [4, 5, 6]]);

		expect(dataFrame.getColumnNames()).to.eql(["a", "b", "c"]);

		var modified = dataFrame.bringToFront(["b", "c"]);

		expect(modified.getColumnNames()).to.eql(["b", "c", "a"]);
		expect(modified.toRows()).to.eql([
			[2, 3, 1],
			[5, 6, 4],
		]);
	});

	it('bringing non-existing column to front has no effect', function () {

		var dataFrame = initDataFrame(["a", "b", "c"], [[1, 2, 3], [4, 5, 6]]);

		expect(dataFrame.getColumnNames()).to.eql(["a", "b", "c"]);

		var modified = dataFrame.bringToFront("non-existing-column");

		expect(modified.getColumnNames()).to.eql(["a", "b", "c"]);
		expect(modified.toRows()).to.eql([
			[1, 2, 3],
			[4, 5, 6],
		]);
	});

	it('can bring column to back', function () {

		var dataFrame = initDataFrame(["a", "b", "c"], [[1, 2, 3], [4, 5, 6]]);

		expect(dataFrame.getColumnNames()).to.eql(["a", "b", "c"]);

		var modified = dataFrame.bringToBack("b");

		expect(modified.getColumnNames()).to.eql(["a", "c", "b"]);
		expect(modified.toRows()).to.eql([
			[1, 3, 2],
			[4, 6, 5],
		]);
	});

	it('can bring multiple columns to back', function () {

		var dataFrame = initDataFrame(["a", "b", "c"], [[1, 2, 3], [4, 5, 6]]);

		expect(dataFrame.getColumnNames()).to.eql(["a", "b", "c"]);

		var modified = dataFrame.bringToBack(["b", "a"]);

		expect(modified.getColumnNames()).to.eql(["c", "b", "a"]);
		expect(modified.toRows()).to.eql([
			[3, 2, 1],
			[6, 5, 4],
		]);
	});

	it('bringing non-existing-column to back has no effect', function () {

		var dataFrame = initDataFrame(["a", "b", "c"], [[1, 2, 3], [4, 5, 6]]);

		expect(dataFrame.getColumnNames()).to.eql(["a", "b", "c"]);

		var modified = dataFrame.bringToBack("non-existing-column");

		expect(modified.getColumnNames()).to.eql(["a", "b", "c"]);
		expect(modified.toRows()).to.eql([
			[1, 2, 3],
			[4, 5, 6],
		]);
	});

	it('can inflate column to new columns', function () {

		var dataFrame = initDataFrame(
			["a", "b"], 
			[
				[1, { X: 2, Y: 3 }], 
				[4, { X: 5, Y: 6 }],
			]
		);

		var inflated = dataFrame.inflateSeries("b");
		expect(inflated.getColumnNames()).to.eql(["a", "b", "X", "Y"]);
		expect(inflated.toRows()).to.eql([
			[1, { X: 2, Y: 3 }, 2, 3],
			[4, { X: 5, Y: 6 }, 5, 6],
		]);
	});

	it('exception is thrown when pivoting table on non-existing columns column', function () {

		var df = new DataFrame({
			columnNames: ["Date", "Ticker", "Close"],
			values: [
				["2016-06-01", "1PG", 5.2],
				["2016-06-02", "1PG", 5.3],
				["2016-06-03", "1PG", 5.4],
			],
		});

		expect(function () {
			df.parseDates("Date")
				.setIndex("Date")
				.pivot("some-column-that-doesnt-exist", "Close")
				;
			})
			.to.throw();
	});

	it('exception is thrown when pivoting table on non-existing values column', function () {

		var df = new DataFrame({
			columnNames: ["Date", "Ticker", "Close"],
			values: [
				["2016-06-01", "1PG", 5.2],
				["2016-06-02", "1PG", 5.3],
				["2016-06-03", "1PG", 5.4],
			],
		});

		expect(function () {
			df.parseDates("Date")
				.setIndex("Date")
				.pivot("Ticker", "some-column-that-doesnt-exist")
				;
			})
			.to.throw();
	});

	it('can pivot table', function () {

		var df = new DataFrame({
			columnNames: ["Date", "Ticker", "Close"],
			values: [
				["2016-06-02", "1PG", 5.2],
				["2016-06-02", "ABC", 5.2],
				["2016-06-02", "MPL", 1.2],

				["2016-06-03", "1PG", 5.3],
				["2016-06-03", "ABC", 4.2],
				["2016-06-03", "MPL", 2.2],

				["2016-06-04", "1PG", 5.4],
				["2016-06-04", "ABC", 3.2],
				["2016-06-04", "MPL", 3.2],
			],
		});

		var pivoted = df //todo: .parseDates("Date") -- Want to get this working with proper dates.
			.setIndex("Date")
			.pivot("Ticker", "Close")
			;

		expect(pivoted.getColumnNames()).to.eql(["1PG", "ABC", "MPL"]);
		expect(pivoted.toRows()).to.eql([
			[5.2, 5.2, 1.2],
			[5.3, 4.2, 2.2],
			[5.4, 3.2, 3.2],
		]);
	});

	it('can parse single columns', function () {

		var df = new DataFrame({
			columnNames: ["V1", "V2"],
			values: [
				['1', '2'],
				['10', '11'],
			],
		});

		var parsed = df.parseInts("V1");
		expect(parsed.toRows()).to.eql([
			[1, '2'],
			[10, '11'],
		]);
	});

	it('can parse multiple columns', function () {

		var df = new DataFrame({
			columnNames: ["V1", "V2"],
			values: [
				['1', '2'],
				['10', '11'],
			],
		});

		var parsed = df.parseInts(["V1", "V2"]);
		expect(parsed.toRows()).to.eql([
			[1, 2],
			[10, 11],
		]);
	});

	it('can convert single series to strings', function () {

		var df = new DataFrame({
			columnNames: ["V1", "V2"],
			values: [
				[1, 2],
				[10, 11],
			],
		});

		var converted = df.toStrings("V1");
		expect(converted.toRows()).to.eql([
			['1', 2],
			['10', 11],
		]);

	});

	it('can convert multiple series to strings', function () {

		var df = new DataFrame({
			columnNames: ["V1", "V2"],
			values: [
				[1, 2],
				[10, 11],
			],
		});

		var converted = df.toStrings(["V1", "V2"]);
		expect(converted.toRows()).to.eql([
			['1', '2'],
			['10', '11'],
		]);

	});

	it('using select on a dataframe redefines the columns', function () {

		var df = new DataFrame({
			columnNames: ["A", "B"],
			values: [
				[1, 10],
				[2, 20],
			],
		});

		var modified = df.select(row => ({ X: row.A, Y: row.B }));

		expect(df.getColumnNames()).to.eql(["A", "B"]);
		expect(modified.getColumnNames()).to.eql(["X", "Y"]);
	});
});
