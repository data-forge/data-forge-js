'use strict';

var E = require('linq');

module.exports = {

	//
	// Drop an element from an array and return a new array with the element removed.
	//
	dropElement: function (arr, index) {
		return E.from(arr)
			.take(index)
			.concat(E.from(arr).skip(index+1))
			.toArray();
	},

};