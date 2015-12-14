'use strict';

describe('format/json', function () {

	var dataForge = require('../index');
	var json = require('../format/json');

	var expect = require('chai').expect;

	it('can load from array of empty objects', function () {

		var options = {};
		var jsFormatter = json(options);

		var jsData = "[{}, {}]";
		var dataFrame = jsFormatter.from(jsData);

		expect(dataFrame.getColumnNames().length).to.eql(0);
		expect(dataFrame.getValues()).to.eql([
			[],
			[],
		]);
	});

	it('error loading from empty string', function () {

		var options = {};
		var jsFormatter = json(options);

		var jsData = "";
		expect(function () {
				jsFormatter.from(jsData);
			}).to.throw();
	});

	it('can load from string with empty json array', function () {

		var options = {};
		var jsFormatter = json(options);

		var jsData = "[]";
		var dataFrame = jsFormatter.from(jsData);

		expect(dataFrame.getColumnNames().length).to.eql(0);
		expect(dataFrame.getValues().length).to.eql(0);
	});

	it('can load from jsson array', function () {

		var options = {};
		var jsFormatter = json(options);

		var jsData = 
			'[' +
				'{' +
					'"Column1": "A",' +
					'"Column2": 1' +
				'},' +
				'{' +
					'"Column1": "B",' +
					'"Column2": 2' +
				'}' +
			']';
		var dataFrame = jsFormatter.from(jsData);

		expect(dataFrame.getColumnNames()).to.eql(['Column1', 'Column2']);
		expect(dataFrame.getValues()).to.eql([
			['A', 1],
			['B', 2],
		]);
	});

	it('uneven columns results in undefined values', function () {

		var options = {};
		var jsFormatter = json(options);

		var jsData = 
			'[' +
				'{' +
					'"Column1": "A"' +
				'},' +
				'{' +
					'"Column2": 2' +
				'}' +
			']';
		var dataFrame = jsFormatter.from(jsData);

		expect(dataFrame.getColumnNames()).to.eql(['Column1', 'Column2']);
		expect(dataFrame.getValues()).to.eql([
			['A', undefined],
			[undefined, 2],
		]);
	});	

	it('can save empty data frame to json', function () {

		var dataFrame = new dataForge.DataFrame([], []);

		var options = {};
		var jsFormatter = json(options);
		var jsData = jsFormatter.to(dataFrame);

		expect(jsData).to.eql("[]");
	});

	it('can save data frame to json', function () {

		var dataFrame = new dataForge.DataFrame(["Column1", "Column2"], [
			['A', 1],
			['B', 2],
		]);

		var options = {};
		var jsFormatter = json(options);
		var jsData = jsFormatter.to(dataFrame);

		expect(jsData).to.be.an('string');

		expect(jsData).to.eql(
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
});