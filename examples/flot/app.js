'use strict'

var panjas = require('../../index.js');
var E = require('linq');

$(function() {
	
	var series = [];
	for (var i = 0; i < 14; i += 0.5) {
		series.push([i, Math.sin(i)]);
	}
	
	var index = new panjas.NumberIndex(E.range(0, 14).toArray());
	var values = E
		.range(0, 14)
		.select(function (i) {
			return [Math.sin(i), Math.cos(i)];
		})
		.toArray();

	var dataFrame = new panjas.DataFrame(["Sin", "Cos"], index, values);
	
	//todo: plot the data frame		
	
	$.plot("#placeholder", [ series ]);
});

console.log('panjas');
console.dir(panjas);