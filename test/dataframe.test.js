'use strict';


describe('DataFrame', function () {
	
	var dataForge = require('../index');	
	var ArrayIterable = require('../src/iterables/array');
	
	var expect = require('chai').expect;

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

	it('can specify rows as an iterable', function () {

		var columns = ["Date", "Value1", "Value2","Value3" ];	
		var rows = [
			[new Date(1975, 24, 2), 100, 'foo', 11],
			[new Date(2015, 24, 2), 200, 'bar', 22],
		];
		var iterable = new ArrayIterable(rows);
		var dataFrame = new dataForge.DataFrame({ columnNames: columns, rows: iterable });
		expect(dataFrame.toValues()).to.eql(rows);
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

	it('column names default to integer index when not specified', function () {

		var rows = [
			['foo', 11],
			['bar', 22],
		];
		var dataFrame = new dataForge.DataFrame({ rows: rows });
		expect(dataFrame.getColumnNames()).to.eql(["0", "1" ]);
	});

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
		expect(columns[0].series.toValues()).to.eql([1, undefined]);

		expect(columns[1].name).to.eql("Col2");
		expect(columns[1].series.toValues()).to.eql(["hello", undefined]);

		expect(columns[2].name).to.eql("Col3");
		expect(columns[2].series.toValues()).to.eql([undefined, 10]);

		expect(columns[3].name).to.eql("Col4");
		expect(columns[3].series.toValues()).to.eql([undefined, "computer"]);
	});

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
});