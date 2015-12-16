'use strict';


describe('DataFrame', function () {
	
	var dataForge = require('../index');	
	
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
		expect(dataFrame.getValues()).to.eql(rows);
	});

	it('default index is generated', function () {

		var columns = ["Date", "Value1", "Value2","Value3" ];	
		var rows = [
			[new Date(1975, 24, 2), 100, 'foo', 11],
			[new Date(2015, 24, 2), 200, 'bar', 22],
		];
		var dataFrame = new dataForge.DataFrame({ columnNames: columns, rows: rows });
		expect(dataFrame.getIndex().getValues()).to.eql([0, 1 ]);
	});

});