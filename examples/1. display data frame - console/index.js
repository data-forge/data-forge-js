'use strict';

var dataForge = require('../../index.js');
var E = require('linq');

// 
// Create a simple data frame.
//
var values = E
	.range(0, 14)
	.select(function (i) {
		return [i, Math.sin(i), Math.cos(i)];
	})
	.toArray();

var dataFrame = new dataForge.DataFrame({
		columnNames: ["index", "Sin", "Cos"], 
		rows: values 
	})
	.setIndex("index")
	.dropColumn("index");

console.log(dataFrame.skip(4).take(5).toString());

var series = dataFrame.getSeries("Sin");
console.log(series.skip(4).take(5).toString());
