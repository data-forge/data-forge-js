'use strict';


describe('Series', function () {
	
	var dataForge = require('../index');
	
	var expect = require('chai').expect; 
	
	var initExampleSeries = function (index) {
		return new dataForge.Series([100, 200], index);
	};

	it('default index is generated', function () {
		
		var column = initExampleSeries();		
		expect(column.getIndex().toValues()).to.eql([			
			0,
			1			
		]);		
	});

	it('can get index', function () {
		
		var column = initExampleSeries(new dataForge.Index([5, 6]));
		expect(column.getIndex().toValues()).to.eql([			
			5,
			6
		]);		
	});
	
	it('can get column values', function () {
		
		var column = initExampleSeries();		
		expect(column.toValues()).to.eql([			
			100,
			200			
		]);		
	});

});