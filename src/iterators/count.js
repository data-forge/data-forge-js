'use strict';

var CountIterator = function () {

	var self = this;

	var working = -1;

	self.moveNext = function () {
		++working;
		return true;
	};

	self.getCurrent = function () {
		if (working < 0) {
			return undefined;
		}
		else {
			return working;
		}
	};

};

module.exports = CountIterator;