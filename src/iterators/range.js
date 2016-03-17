'use strict';

var RangeIterator = function (startIndex, count) {

	var self = this;
	var working = startIndex-1;

	self.moveNext = function () {
		return ++working < startIndex+count;
	};

	self.getCurrent = function () {
		if (working < startIndex || working >= startIndex+count) {
			return undefined;
		}
		else {
			return working;
		}
	};

};

module.exports = RangeIterator;