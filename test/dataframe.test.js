'use strict';


describe('DataFrame', function () {
	
	var dataForge = require('../index');	
	var DataFrame = require('../src/dataframe');
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
			rows: values,			
		};

		if (index) {
			config.index = new dataForge.Index(index);
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
		expect(dataFrame.toValues()).to.eql([
			[new Date(2011, 24, 2), 300, 'c', 3],
			[new Date(1975, 24, 2), 200, 'b', 1],
			[new Date(2013, 24, 2), 20, 'c', 22],
			[new Date(2015, 24, 2), 100, 'd', 4],
		]);
	});
	
	it('can skip', function () {
		var columnNames = ["Date", "Value1", "Value2", "Value3"];
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
		var skipped = dataFrame.skip(2);		
		expect(skipped.getColumnNames()).to.eql(columnNames);
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

	it('can filter on index', function () {
		var dataFrame = initDataFrame(
			[ "V" ],
			[
				[1],
				[2],
				[3],
				[4],
			],
			[5, 6, 7, 8]
		);
		var filtered = dataFrame.where(function (row, index) {
				return index > 5 && index < 8;
			});		
		expect(filtered.toPairs()).to.eql([
			[6, { V: 2 }],
			[7, { V: 3 }],
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

	it('can select with index', function () {
		var dataFrame = initDataFrame(
			[ "V" ],
			[
				[1],
				[2],
				[3],
				[4],
			],
			[5, 6, 7, 8]
		);

		var modified = dataFrame.select(function (row, index) {
				return {
					C: index
				};
			});		

		expect(modified.toPairs()).to.eql([
			[5, { C: 5 }],
			[6, { C: 6 }],
			[7, { C: 7 }],
			[8, { C: 8 }],
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

	it('can select many with index', function () {
		var dataFrame = initDataFrame(
			[ "V" ],
			[
				[1],
				[2],
				[3],
				[4],
			],
			[5, 6, 7, 8]
		);

		var modified = dataFrame.selectMany(function (row, index) {
				return E.range(0, 2).
					select(function (i) {
						return {
							V: index
						};					
					})
					.toArray();
			});		

		expect(modified.toPairs()).to.eql([
			[5, { V: 5 }],
			[5, { V: 5 }],
			[6, { V: 6 }],
			[6, { V: 6 }],
			[7, { V: 7 }],
			[7, { V: 7 }],
			[8, { V: 8 }],
			[8, { V: 8 }],
		]);
	});		

	it('responds gracefully to null return from select', function () {

		var dataFrame = initDataFrame(
			[ "V" ],
			[
				[300],
			]
		);
		var modified = dataFrame.select(function (row) {
				return null;
			});		
		expect(function () {
				modified.toValues();
			})
			.to.throw();
	});

	it('responds gracefully to null return from select many', function () {

		var dataFrame = initDataFrame(
			[ "V" ],
			[
				[300],
			]
		);
		var modified = dataFrame.selectMany(function (row) {
				return null;
			});		
		expect(function () {
				modified.toValues();
			})
			.to.throw();			
	});

	it('responds gracefully to undefined return from select', function () {

		var dataFrame = initDataFrame(
			[ "V" ],
			[
				[300],
			]
		);
		var modified = dataFrame.select(function (row) {
				// Undefined
			});		
		expect(function () {
				modified.toValues();
			})
			.to.throw();
	});

	it('responds gracefully to undefined return from select many', function () {

		var dataFrame = initDataFrame(
			[ "V" ],
			[
				[300],
			]
		);
		var modified = dataFrame.selectMany(function (row) {
				// Undefined
			});		
		expect(function () {
				modified.toValues();
			})
			.to.throw();			
	});

	it('responds gracefully to non-list return from select many', function () {

		var dataFrame = initDataFrame(
			[ "V" ],
			[
				[300],
			]
		);
		var modified = dataFrame.selectMany(function (row) {
				return { // Return an object, not a list!
					Blah: 1
				};
			});		
		expect(function () {
				modified.toValues();
			})
			.to.throw();			
	});

	it('responds gracefully to list with null entry returned from select many', function () {

		var dataFrame = initDataFrame(
			[ "V" ],
			[
				[300],
			]
		);
		var modified = dataFrame.selectMany(function (row) {
				return [ null ];
			});		
		expect(function () {
				modified.toValues();
			})
			.to.throw();			
	});

	it('responds gracefully to list with undefined entry returned from select many', function () {

		var dataFrame = initDataFrame(
			[ "V" ],
			[
				[300],
			]
		);
		var modified = dataFrame.selectMany(function (row) {
				return [ undefined ];
			});		
		expect(function () {
				modified.toValues();
			})
			.to.throw();			
	});

	it('responds gracefully to list with non-object entry returned from select many', function () {

		var dataFrame = initDataFrame(
			[ "V" ],
			[
				[300],
			]
		);
		var modified = dataFrame.selectMany(function (row) {
				return [ 5.0 ];
			});		
		expect(function () {
				modified.toValues();
			})
			.to.throw();			
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
			rows: [
				[1]
			],
		});

		var series = dataFrame.getSeries("non-existing-column");
		expect(series.toPairs()).to.eql([]);
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

		expect(columns[0].name).to.eql('Date');
		expect(columns[0].series.toValues()).to.eql([new Date(1975, 24, 2), new Date(2015, 24, 2)]);

		expect(columns[2].name).to.eql('Value2');
		expect(columns[2].series.toValues()).to.eql(['foo', 'bar']);
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
		var modified = dataFrame.dropSeries('Date');
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
		var modified = dataFrame.dropSeries(['Date', 'Value2'])
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
		var modified = dataFrame.dropSeries('non-existing-column');
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
		var newSeries = new dataForge.Series({ values: [4, 3, 2, 1], index: newIndex });
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

		expect(mergedSeries.getIndex().toValues()).to.eql([5, 7]);
		expect(mergedSeries.toValues()).to.eql([3, 1]);
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

	it('can set column procedurally from a function - with index', function () {

		var original = initDataFrame(
			[ "Existing" ],
			[
				[11],
				[12],
			],
			[5, 6]
		);		

		var modified = original.setSeries('Generated', 
				function (row, index) {
					return index;
				}
			);

		expect(modified.toPairs()).to.eql([
			[5, { Existing: 11, Generated: 5 }],
			[6, { Existing: 12, Generated: 6 }],
		]);
	});

	it('can get slice of rows', function () {

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
		var slice = dataFrame.slice(6, 8);
		expect(slice.toPairs()).to.eql([
			[6, { Value1: 200, Value2: 'b', Value3: 1 }],
			[7, { Value1: 20, Value2: 'c', Value3: 22 }],
		]);
	});

	it('can get slice of rows with explicit predicates', function () {

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
		var slice = dataFrame.slice(
			function (indexValue) {
				return indexValue < 6;
			},
			function (indexValue) {
				return indexValue < 8;
			}
		);
		expect(slice.toPairs()).to.eql([
			[6, { Value1: 200, Value2: 'b', Value3: 1 }],
			[7, { Value1: 20, Value2: 'c', Value3: 22 }],
		]);
	});

	it('can get slice of rows from time series', function () {

		var dataFrame = initDataFrame(
			[ "Value1", "Value2", "Value3" ],
			[
				[300, 'c', 3],
				[200, 'b', 1],
				[20, 'c', 22],
				[100, 'd', 4],
			],
			[new Date(2016, 1, 1), new Date(2016, 1, 3), new Date(2016, 1, 5), new Date(2016, 1, 10)]
		);
		var slice = dataFrame.slice(new Date(2016, 1, 2), new Date(2016, 1, 8),
			function (a, b) {
				return moment(a).isBefore(b);
			}
		);
		expect(slice.toPairs()).to.eql([
			[new Date(2016, 1, 3), { Value1: 200, Value2: 'b', Value3: 1 }],
			[new Date(2016, 1, 5), { Value1: 20, Value2: 'c', Value3: 22 }],
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
		expect(columns[0].series.toValues()).to.eql([300, 200]);
		expect(columns[1].series.toValues()).to.eql(['c', 'b']);
		expect(columns[2].series.toValues()).to.eql([3, 1]);
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
		var renamed = dataFrame.renameColumn(oldColumnName, newColumnName);

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
		var modified = dataFrame.transformSeries({
				Column2: function (value) {
					return value + 100;
				}
			});
		expect(dataFrame.getSeries("Column2").toValues()).to.eql([1, 2]);
		expect(modified.getSeries("Column2").toValues()).to.eql([101, 102]);
	});

	it('can transform multple columns', function () {

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
		expect(dataFrame.getSeries("Column1").toValues()).to.eql(['A', 'B']);
		expect(dataFrame.getSeries("Column2").toValues()).to.eql([1, 2]);
		expect(modified.getSeries("Column1").toValues()).to.eql(['AA', 'BB']);
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
		var modified = dataFrame.transformSeries({
				"non-existing-column": function (value) {
					return value + 100;
				},
			});
		expect(dataFrame).to.equal(modified);
		expect(dataFrame.getColumnNames()).to.eql(columnNames);
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

	it('can compute window - creates an empty series from an empty data set', function () {

		var dataFrame = new DataFrame();
		var windowed = dataFrame.window(2, function (window, windowIndex) {
			return [windowIndex, window.sum()];
		});

		expect(windowed.count()).to.eql(0);
	});

	it('can compute window - with even window size and even number of rows', function () {

		var dataFrame = new DataFrame({ 
			columnNames: ["c1", "c2"],
			rows: [
				[1, 2],
				[3, 4],
				[5, 6],
				[7, 8],
			],
		});
		var windowed = dataFrame.window(2, function (window, windowIndex) {
			return [windowIndex, window.toValues()];
		});

		expect(windowed.toPairs()).to.eql([
			[0, [[1, 2], [3, 4]]],
			[1, [[5, 6], [7, 8]]],
		]);
	});

	it('can compute window - with even window size and odd number of rows', function () {

		var dataFrame = new DataFrame({ 
			columnNames: ["c1", "c2"],
			rows: [
				[1, 2],
				[3, 4],
				[5, 6],
				[7, 8],
				[9, 10],
			],
		});
		var windowed = dataFrame.window(2, function (window, windowIndex) {
			return [windowIndex, window.toValues()];
		});

		expect(windowed.toPairs()).to.eql([
			[0, [[1, 2], [3, 4]]],
			[1, [[5, 6], [7, 8]]] ,
			[2, [[9, 10]]],
		]);
	});

	it('can compute window - with odd window size and odd number of rows', function () {

		var dataFrame = new DataFrame({ 
			columnNames: ["c1", "c2"],
			rows: [
				[1, 2],
				[3, 4],
				[5, 6],
				[7, 8],
				[9, 10],
				[11, 12],
			],
		});
		var windowed = dataFrame.window(3, function (window, windowIndex) {
			return [windowIndex, window.toValues()];
		});

		expect(windowed.toPairs()).to.eql([
			[0, [[1, 2], [3, 4], [5, 6]]],
			[1, [[7, 8], [9, 10], [11, 12]]],
		]);

	});

	it('can compute window - with odd window size and even number of rows', function () {

		var dataFrame = new DataFrame({ 
			columnNames: ["c1", "c2"],
			rows: [
				[1, 2],
				[3, 4],
				[5, 6],
				[7, 8],
				[9, 10],
			],
		});
		var windowed = dataFrame.window(3, function (window, windowIndex) {
			return [windowIndex, window.toValues()];
		});

		expect(windowed.toPairs()).to.eql([
			[0, [[1, 2], [3, 4], [5, 6]]],
			[1, [[7, 8], [9, 10]]],
		]);

	});

	it('can compute rolling window - from empty data set', function () {

		var dataFrame = genDataFrame(0, 0);
		var newDataFrame = dataFrame.rollingWindow(2, function (window, windowIndex) {
			return [windowIndex, window.toValues()];
		});

		expect(newDataFrame.toValues().length).to.eql(0);
	});

	it('rolling window returns 0 values when there are not enough values in the data set', function () {

		var dataFrame = genDataFrame(2, 2);
		var newDataFrame = dataFrame.rollingWindow(3, function (window, windowIndex) {
			return [windowIndex, window.toValues()];
		});

		expect(newDataFrame.toValues().length).to.eql(0);
	});

	it('can compute rolling window - odd data set with even period', function () {

		var dataFrame = genDataFrame(2, 5);
		var newDataFrame = dataFrame.rollingWindow(2, function (window, windowIndex) {
			return [windowIndex, window.toValues()];
		});

		var index = newDataFrame.getIndex().toValues();
		expect(index).to.eql([0, 1, 2, 3]);

		var values = newDataFrame.toValues();
		expect(values.length).to.eql(4);
		expect(values).to.eql([
			[[1, 2], [2, 4]],
			[[2, 4], [3, 6]],
			[[3, 6], [4, 8]],
			[[4, 8], [5, 10]],
		]);
	});

	it('can compute rolling window - odd data set with odd period', function () {

		var dataFrame = genDataFrame(2, 5);
		var newDataFrame = dataFrame.rollingWindow(3, function (window, windowIndex) {
			return [windowIndex, window.toValues()];
		});

		var index = newDataFrame.getIndex().toValues();
		expect(index).to.eql([0, 1, 2]);

		var values = newDataFrame.toValues();
		expect(values.length).to.eql(3);
		expect(values).to.eql([
			[[1, 2], [2, 4], [3, 6]],
			[[2, 4], [3, 6], [4, 8]],
			[[3, 6], [4, 8], [5, 10]],
		]);
	});

	it('can compute rolling window - even data set with even period', function () {

		var dataFrame = genDataFrame(2, 6);
		var newDataFrame = dataFrame.rollingWindow(2, function (window, windowIndex) {
			return [windowIndex+10, window.toValues()];
		});

		var index = newDataFrame.getIndex().toValues();
		expect(index).to.eql([10, 11, 12, 13, 14]);

		var values = newDataFrame.toValues();
		expect(values.length).to.eql(5);
		expect(values).to.eql([
			[[1, 2], [2, 4]],
			[[2, 4], [3, 6]],
			[[3, 6], [4, 8]],
			[[4, 8], [5, 10]],
			[[5, 10], [6, 12]],
		]);
	});

	it('can compute rolling window - even data set with odd period', function () {

		var dataFrame = genDataFrame(2, 6);
		var newDataFrame = dataFrame.rollingWindow(3, function (window, windowIndex) {
			return [windowIndex, window.toValues()];
		});

		var index = newDataFrame.getIndex().toValues();
		expect(index).to.eql([0, 1, 2, 3]);

		var values = newDataFrame.toValues();
		expect(values.length).to.eql(4);
		expect(values).to.eql([
			[[1, 2], [2, 4], [3, 6]],
			[[2, 4], [3, 6], [4, 8]],
			[[3, 6], [4, 8], [5, 10]],
			[[4, 8], [5, 10], [6, 12]],
		]);
	});

	it('can compute rolling window - can take last index and value from each window', function () {

		var dataFrame = genDataFrame(2, 6);
		var newDataFrame = dataFrame.rollingWindow(3, function (window, windowIndex) {
			var index = window.getIndex().toValues();
			var values = window.toValues();
			return [index[index.length-1], values[values.length-1]];
		});

		var index = newDataFrame.getIndex().toValues();
		expect(index).to.eql([2, 3, 4, 5]);

		var values = newDataFrame.toValues();
		expect(values).to.eql([[3, 6], [4, 8], [5, 10], [6, 12]]);
	});

	it('getting first row of empty data-frame throws exception', function () {

		var dataFrame = initDataFrame([], [], []);

		expect(function () {
			dataFrame.first();
		}).to.throw();
	});

	it('getting last row of empty data-frame throws exception', function () {

		var dataFrame = initDataFrame([], [], []);

		expect(function () {
			dataFrame.last();
		}).to.throw();
	});

	it('can get first and last rows in data frame', function () {

		var dataFrame = initDataFrame(
				["Column1", "Column2"], 
				[
					['A', 1],
					['B', 2],
					['C', 3],
				],
				[10, 11, 12]
			);

		expect(dataFrame.first()).to.eql({
			Column1: 'A',
			Column2: 1,
		});
		expect(dataFrame.last()).to.eql({
			Column1: 'C',
			Column2: 3,
		});
	});

	it('can reverse', function () {

		var dataFrame = initDataFrame(
				["Column1", "Column2"], 
				[
					['A', 1],
					['B', 2],
					['C', 3],
				],
				[10, 11, 12]
			);

		var reversed = dataFrame.reverse();
		expect(dataFrame.toValues()).to.eql([
			['A', 1],
			['B', 2],
			['C', 3],
		]);
		expect(dataFrame.getIndex().toValues()).to.eql([10, 11, 12]);
		expect(reversed.toValues()).to.eql([
			['C', 3],
			['B', 2],
			['A', 1],
		]);
		expect(reversed.getIndex().toValues()).to.eql([12, 11, 10]);
	})

	it('can generate column', function () {

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

		var modified = dataFrame.generateColumns(function (row) {
				return {
					NewColumn: row.Column1 + row.Column2,
				};
			});

		var newColumnName = "NewColumn";
		var newColumnNames = initialColumns.concat([newColumnName]);

		expect(dataFrame.getColumnNames()).to.eql(initialColumns);
		expect(modified.getColumnNames()).to.eql(newColumnNames);
		expect(modified.getSeries(newColumnName).toValues()).to.eql([11, 22, 33]);
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

		expect(series.toValues()).to.eql([11, 22, 33]);
	});

	it('can deflate dataframe to series - with index', function () {

		var dataFrame = initDataFrame(
				["Column1", "Column2"], 
				[
					[1, 10],
					[2, 20],
					[3, 30],
				],
				[10, 11, 12]
			);

		var series = dataFrame.deflate(function (row, index) {
				return index;
			});

		expect(series.toPairs()).to.eql([
			[10, 10], 
			[11, 11], 
			[12, 12],
		]);
	});

	it('can get head of data frame', function () {

		var dataFrame = initDataFrame(
				["Column1", "Column2"], 
				[
					[1, 10],
					[2, 20],
					[3, 30],
				],
				[10, 11, 12]
			);

		var head = dataFrame.head(2);
		expect(head.toValues()).to.eql([
			[1, 10],
			[2, 20],
		]);
	});

	it('can get tail of data frame', function () {

		var dataFrame = initDataFrame(
				["Column1", "Column2"], 
				[
					[1, 10],
					[2, 20],
					[3, 30],
				],
				[10, 11, 12]
			);

		var head = dataFrame.tail(2);
		expect(head.toValues()).to.eql([
					[2, 20],
					[3, 30],
		]);
	});

	it('can skip while', function () {

		var dataFrame = initDataFrame(
				["Column1"], 
				[
					[true],
					[true],
					[false],
					[true],
				],
				[0, 1, 2, 3]
			);
		var skipped = dataFrame.skipWhile(function (row) { return row.Column1; });
		expect(skipped.toPairs()).to.eql([
			[2, { Column1: false }],
			[3, { Column1: true }],
		]);
	});

	it('can skip while - with index', function () {

		var dataFrame = initDataFrame(
				["Column1"], 
				[
					[true],
					[true],
					[false],
					[true],
				],
				[true, true, false, true]
			);
		var skipped = dataFrame.skipWhile(function (row, index) { 
			return index; 
		});
		expect(skipped.toPairs()).to.eql([
			[false, { Column1: false }],
			[true, { Column1: true }],
		]);
	});

	it('can skip until', function () {

		var dataFrame = initDataFrame(
				["Column1"], 
				[
					[false],
					[false],
					[true],
					[false],
				],
				[0, 1, 2, 3]
			);
		var skipped = dataFrame.skipUntil(function (row) { return row.Column1; });
		expect(skipped.toPairs()).to.eql([
			[2, { Column1: true }],
			[3, { Column1: false }]
		]);
	});

	it('can skip until - with index', function () {

		var dataFrame = initDataFrame(
				["Column1"], 
				[
					[false],
					[false],
					[true],
					[false],
				],
				[false, false, true, false]
			);

		var skipped = dataFrame.skipUntil(function (row, index) { 
			return index; 
		});

		expect(skipped.toPairs()).to.eql([
			[true, { Column1: true }],
			[false, { Column1: false }]
		]);
	});

	it('can take while', function () {

		var dataFrame = initDataFrame(
				["Column1"], 
				[
					[true],
					[true],
					[false],
					[true],
				],
				[0, 1, 2, 3]
			);
		var skipped = dataFrame.takeWhile(function (row) { return row.Column1; });
		expect(skipped.toPairs()).to.eql([
			[0, { Column1: true }],
			[1, { Column1: true }],
		]);
	});

	it('can take while - with index', function () {

		var dataFrame = initDataFrame(
				["Column1"], 
				[
					[true],
					[true],
					[false],
					[true],
				],
				[true, true, false, true]
			);
		
		var skipped = dataFrame.takeWhile(function (row, index) { 
			return index; 
		});
		
		expect(skipped.toPairs()).to.eql([
			[true, { Column1: true }],
			[true, { Column1: true }],
		]);
	});

	it('can take until', function () {

		var dataFrame = initDataFrame(
				["Column1"], 
				[
					[false],
					[false],
					[true],
					[false],
				],
				[0, 1, 2, 3]
			);
		var skipped = dataFrame.takeUntil(function (row) { return row.Column1; });
		expect(skipped.toPairs()).to.eql([
			[0, { Column1: false }],
			[1, { Column1: false }],
		]);
	});

	it('can take until - with index', function () {

		var dataFrame = initDataFrame(
				["Column1"], 
				[
					[false],
					[false],
					[true],
					[false],
				],
				[false, false, true, false]
			);
		var skipped = dataFrame.takeUntil(function (row, index) { 
			return index; 
		});
		expect(skipped.toPairs()).to.eql([
			[false, { Column1: false }],
			[false, { Column1: false }],
		]);
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
		var dataFrame = new dataForge.DataFrame({ columnNames: columns, rows: [] });
		expect(dataFrame.getColumnNames()).to.eql(columns);
	});

	it('can get rows', function () {
		
		var columns = ["Date", "Value1", "Value2","Value3" ];	
		var rows = [
			[new Date(1975, 24, 2), 100, 'foo', 11],
			[new Date(2015, 24, 2), 200, 'bar', 22],
		];
		var dataFrame = new dataForge.DataFrame({ columnNames: columns, rows: rows });
		expect(dataFrame.toValues()).to.eql(rows);
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
		var dataFrame = new dataForge.DataFrame({ columnNames: columns, rows: iterable });
		expect(dataFrame.toValues()).to.eql(rows);
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
		var dataFrame = new dataForge.DataFrame({ rows: iterable });
		expect(dataFrame.getColumnNames()).to.eql(["V1", "V2"]);
		expect(dataFrame.getSeries("V1").toValues()).to.eql([1, 2]);
		expect(dataFrame.getSeries("V2").toValues()).to.eql([10, 100]);
	});

	it('default index is generated', function () {

		var columns = ["Date", "Value1", "Value2","Value3" ];	
		var rows = [
			[new Date(1975, 24, 2), 100, 'foo', 11],
			[new Date(2015, 24, 2), 200, 'bar', 22],
		];
		var dataFrame = new dataForge.DataFrame({ columnNames: columns, rows: rows });
		expect(dataFrame.getIndex().toValues()).to.eql([0, 1 ]);
	});

	it('there are no rows or columns when no columns or rows are specified', function () {
		
		var dataFrame = new dataForge.DataFrame();
		expect(dataFrame.getColumnNames()).to.eql([]);
		expect(dataFrame.getColumns()).to.eql([]);
		expect(dataFrame.toValues()).to.eql([]);
	})

	it('there are no rows or columns when no columns or rows are specified', function () {
		
		var dataFrame = new dataForge.DataFrame({});
		expect(dataFrame.getColumnNames()).to.eql([]);
		expect(dataFrame.getColumns()).to.eql([]);
		expect(dataFrame.toValues()).to.eql([]);
	})

	it('can initialize from array of objects', function () {

		var dataFrame = new dataForge.DataFrame({
				rows: [
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
		expect(dataFrame.toValues()).to.eql([
			[1, 'hello'],
			[10, 'computer'],
		])
		
		var columns = dataFrame.getColumns();
		expect(columns.length).to.eql(2);

		expect(columns[0].name).to.eql("Col1");
		expect(columns[0].series.toValues()).to.eql([1, 10]);

		expect(columns[1].name).to.eql("Col2");
		expect(columns[1].series.toValues()).to.eql(["hello", "computer"]);
	});

	/*todo: Would like to enable this feature again one day.

	it('can initialize from array of objects with different fields', function () {

		var dataFrame = new dataForge.DataFrame({
				rows: [
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

		expect(dataFrame.toValues()).to.eql([
			[1, 'hello', undefined, undefined],
			[undefined, undefined, 10, 'computer'],
		]);
		
		var columns = dataFrame.getColumns();
		expect(columns.length).to.eql(4);

		expect(columns[0].name).to.eql("Col1");
		expect(columns[0].series.toValues()).to.eql([1]);

		expect(columns[1].name).to.eql("Col2");
		expect(columns[1].series.toValues()).to.eql(["hello"]);

		expect(columns[2].name).to.eql("Col3");
		expect(columns[2].series.toValues()).to.eql([10]);

		expect(columns[3].name).to.eql("Col4");
		expect(columns[3].series.toValues()).to.eql(["computer"]);
	});
	*/	

	it('can initialize from array of objects with zero fields', function () {

		var dataFrame = new dataForge.DataFrame({
				rows: [
					{},
					{}
				]
			});

		expect(dataFrame.getColumnNames()).to.eql([]);
		expect(dataFrame.getColumns()).to.eql([]);
		expect(dataFrame.toValues()).to.eql([[], []]);
	});	

	it('can convert to javascript object', function () {

		var dataFrame = initDataFrame(
			["Key", "Value"],
			[
				['A', 100],
				['B', 200],
			],
			[5, 6]
		);

		var obj = dataFrame.toObject(
			function (row) {
				return row.Key;
			},
			function (row) {
				return row.Value;
			}
		);
		expect(obj).to.eql({
			A: 100,
			B: 200,
		});
	});

	it('can convert to javascript object - with duplicate keys', function () {

		var dataFrame = initDataFrame(
			["Key", "Value"],
			[
				['A', 100],
				['B', 200],
				['A', 3],
			],
			[5, 6, 7]
		);

		var obj = dataFrame.toObject(
			function (row) {
				return row.Key;
			},
			function (row) {
				return row.Value;
			}
		);
		expect(obj).to.eql({
			A: 3,
			B: 200,
		});
	});

	it('can zip multiple data-frames', function () {

	 	var df1 = initDataFrame(["a", "b"], [[1, 2], [3, 4]]);
	 	var df2 = initDataFrame(["c", "d"], [[6, 5], [8, 7]]);
	 	var df3 = initDataFrame(["e", "f"], [[9, 10], [11, 12]]);

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

	it('can bring column to front', function () {

		var dataFrame = initDataFrame(["a", "b", "c"], [[1, 2, 3], [4, 5, 6]]);

		expect(dataFrame.getColumnNames()).to.eql(["a", "b", "c"]);

		var modified = dataFrame.bringToFront("b");

		expect(modified.getColumnNames()).to.eql(["b", "a", "c"]);
		expect(modified.toValues()).to.eql([
			[2, 1, 3],
			[5, 4, 6],
		]);
	});

	it('can bring multiple columns to front', function () {

		var dataFrame = initDataFrame(["a", "b", "c"], [[1, 2, 3], [4, 5, 6]]);

		expect(dataFrame.getColumnNames()).to.eql(["a", "b", "c"]);

		var modified = dataFrame.bringToFront(["b", "c"]);

		expect(modified.getColumnNames()).to.eql(["b", "c", "a"]);
		expect(modified.toValues()).to.eql([
			[2, 3, 1],
			[5, 6, 4],
		]);
	});

	it('bringing non-existing column to front has no effect', function () {

		var dataFrame = initDataFrame(["a", "b", "c"], [[1, 2, 3], [4, 5, 6]]);

		expect(dataFrame.getColumnNames()).to.eql(["a", "b", "c"]);

		var modified = dataFrame.bringToFront("non-existing-column");

		expect(modified.getColumnNames()).to.eql(["a", "b", "c"]);
		expect(modified.toValues()).to.eql([
			[1, 2, 3],
			[4, 5, 6],
		]);
	});

	it('can bring column to back', function () {

		var dataFrame = initDataFrame(["a", "b", "c"], [[1, 2, 3], [4, 5, 6]]);

		expect(dataFrame.getColumnNames()).to.eql(["a", "b", "c"]);

		var modified = dataFrame.bringToBack("b");

		expect(modified.getColumnNames()).to.eql(["a", "c", "b"]);
		expect(modified.toValues()).to.eql([
			[1, 3, 2],
			[4, 6, 5],
		]);
	});

	it('can bring multiple columns to back', function () {

		var dataFrame = initDataFrame(["a", "b", "c"], [[1, 2, 3], [4, 5, 6]]);

		expect(dataFrame.getColumnNames()).to.eql(["a", "b", "c"]);

		var modified = dataFrame.bringToBack(["b", "a"]);

		expect(modified.getColumnNames()).to.eql(["c", "b", "a"]);
		expect(modified.toValues()).to.eql([
			[3, 2, 1],
			[6, 5, 4],
		]);
	});

	it('bringing non-existing-column to back has no effect', function () {

		var dataFrame = initDataFrame(["a", "b", "c"], [[1, 2, 3], [4, 5, 6]]);

		expect(dataFrame.getColumnNames()).to.eql(["a", "b", "c"]);

		var modified = dataFrame.bringToBack("non-existing-column");

		expect(modified.getColumnNames()).to.eql(["a", "b", "c"]);
		expect(modified.toValues()).to.eql([
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

		var inflated = dataFrame.inflateColumn("b");
		expect(inflated.getColumnNames()).to.eql(["a", "b", "X", "Y"]);
		expect(inflated.toValues()).to.eql([
			[1, { X: 2, Y: 3 }, 2, 3],
			[4, { X: 5, Y: 6 }, 5, 6],
		]);
	});

	it('for each', function () {

		var dataFrame = initDataFrame(
			["a", "b"], 
			[
				[0, 10], 
				[1, 11],
				[2, 12],
			]
		);

		var count = 0;
		dataFrame.forEach(function (v, i) {
			expect(i).to.eql(count);
			expect(v.a).to.eql(count);
			expect(v.b).to.eql(count + 10);
			++count;
		});

		expect(count).to.eql(3);
	});

	it('can group by', function () {

		var columnNames = ["a", "b"];
		var dataFrame = initDataFrame(
			columnNames, 
			[
				["x", 1], 
				["x", 2],
				["y", 10],
				["x", 3], 
				["y", 11],
				["x", 4],
			]
		);

		var count = 0;
		var groups = dataFrame.groupBy(function (row, index) {
				expect(index).to.eql(count);
				++count;
				return row.a;
			});

		expect(count).to.eql(6);		

		expect(groups[0].key).to.eql("x");
		expect(groups[0].data.getColumnNames()).to.eql(columnNames);
		expect(groups[0].data.toPairs()).to.eql([
			[0, { a: "x", b: 1 } ],
			[1, { a: "x", b: 2 } ],
			[3, { a: "x", b: 3 } ],
			[5, { a: "x", b: 4 } ],
		]);

		expect(groups[1].key).to.eql("y");
		expect(groups[1].data.getColumnNames()).to.eql(columnNames);
		expect(groups[1].data.toPairs()).to.eql([
			[2, { a: "y", b: 10 } ],
			[4, { a: "y", b: 11 } ],
		]);	
	});

});
