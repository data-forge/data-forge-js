'use strict';

var CountIterator = function () {

	var self = this;
	self._working = -1;
};

module.exports = CountIterator;

CountIterator.prototype.moveNext = function () {

	var self = this;
	++self._working;
	return true;
};

CountIterator.prototype.getCurrent = function () {

	var self = this;
	if (self._working < 0) {
		return undefined;
	}
	else {
		return self._working;
	}
};