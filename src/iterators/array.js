'use strict';

//
// Data-forge enumerator for iterating a standard JavaScript array.
//
var ArrayIterator = function (arr) {

	var self = this;

	var rowIndex = -1;
	
	self.moveNext = function () {
		return ++rowIndex < arr.length;
	};

	self.getCurrent = function () {
		if (rowIndex >= 0 && rowIndex < arr.length) {
			return arr[rowIndex];
		}
		else {
			return undefined;
		}		
	};

	//
	// Bake the iterator into an array.
	//
	self.realize = function () {

		var output = [];

		while (self.moveNext()) {
			output.push(self.getCurrent());
		}

		return output;
	};
};

module.exports = ArrayIterator;