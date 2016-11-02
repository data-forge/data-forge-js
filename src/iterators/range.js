'use strict';

var RangeIterator = function (startIndex, count) {

	var self = this;
	self._working = startIndex-1;
	self._startIndex = startIndex;
	self._count = count;
};


module.exports = RangeIterator;

RangeIterator.prototype.moveNext = function () {

	var self = this;
	if (self._working < self._startIndex+self._count-1) {
		++self._working;
		return true;
	}
	
	return false;
};

RangeIterator.prototype.getCurrent = function () {

	var self = this;
	if (self._working < self._startIndex || self._working >= self._startIndex+self._count) {
		return undefined;
	}
	else {
		return self._working;
	}
};
