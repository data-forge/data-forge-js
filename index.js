'use strict';

var Series = function (values) {
	var self = this;
	self._values = values;	
};

Series.prototype.index = function () {
	return [
		new Date(1975, 24, 2),
		new Date(2015, 10, 23),			
	];	
};

Series.prototype.values = function () {
	var self = this;
	return self._values;	
};

var DataFrame = function (columnNames, values) {
	var self = this;
	self._columnNames = columnNames;
	self._values = values;	
};

DataFrame.prototype.series = function (columnName) {
	if (columnName === 'Value1') {
		return new Series([
			100,
			300,			
		]);	
	}
	else if (columnName === 'Value2') {
		return new Series([
			'foo',
			'bar',			
		]);
	}
	else {
		throw new Error('Bad column name!');
	}
};

DataFrame.prototype.index = function () {
	return [
		new Date(1975, 24, 2),
		new Date(2015, 10, 23),			
	];	
};

DataFrame.prototype.columns = function () {
	var self = this;
	return self._columnNames;	
};

DataFrame.prototype.values = function () {
	var self = this;
	return self._values;
};

DataFrame.prototype.dataFrame = function (columnNames) {
	return new DataFrame(
		[
			'Value1',
			'Value3',
		],
		[
			[100, 22],
			[300, 23],			
		]
	);	
};

module.exports = {
	
	read_csv: function () {
		return new DataFrame(
			[
				'Value1',
				'Value2',
				'Value3',			
			],
			[
				[100, "foo", 22],
				[300, "bar", 23],			
			]
		);		
	},
};