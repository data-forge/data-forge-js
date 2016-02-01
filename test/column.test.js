'use strict';


describe('Column', function () {
	
	var dataForge = require('../index');
	
	var expect = require('chai').expect; 
	
	var initExampleColumn = function (index) {
		var series = new dataForge.Series({ values: [100, 200], index: index });
		return new dataForge.Column('some-column', series);
	};

	it('default index is generated', function () {
		
		var column = initExampleColumn();		
		expect(column.getSeries().getIndex().toValues()).to.eql([			
			0,
			1			
		]);		
	});

	it('can get series index', function () {
		
		var column = initExampleColumn(new dataForge.Index([5, 6]));
		expect(column.getSeries().getIndex().toValues()).to.eql([			
			5,
			6
		]);		
	});
	
	it('can get series values', function () {
		
		var column = initExampleColumn();		
		expect(column.getSeries().toValues()).to.eql([			
			100,
			200			
		]);		
	});

});