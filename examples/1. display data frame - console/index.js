'use strict';

var panjas = require('../../index.js');
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

var dataFrame = new panjas.DataFrame(["index", "Sin", "Cos"], values);

console.log(dataFrame.skip(10).toString());
