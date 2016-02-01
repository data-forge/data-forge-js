'use strict';


describe('Series', function () {
	
	var dataForge = require('../index');
	
	var expect = require('chai').expect; 
	
	it('default index is generated', function () {
		
		var column = new dataForge.Series({ values: [100, 200] });
		expect(column.getIndex().toValues()).to.eql([			
			0,
			1			
		]);		
	});

	it('can get index', function () {
		
		var column = new dataForge.Series({ values: [100, 200], index: new dataForge.Index([5, 6]) });
		expect(column.getIndex().toValues()).to.eql([
			5,
			6
		]);		
	});
	
	it('can get column values', function () {
		
		var column = new dataForge.Series({ values: [100, 200] });
		expect(column.toValues()).to.eql([			
			100,
			200			
		]);		
	});
});