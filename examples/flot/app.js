'use strict'

var panjas = require('../../index.js');

$(function() {
	
	var series = [];
	for (var i = 0; i < 14; i += 0.5) {
		series.push([i, Math.sin(i)]);
	}

	$.plot("#placeholder", [ series ]);
});

console.log('panjas');
console.dir(panjas);