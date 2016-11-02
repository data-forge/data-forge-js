'use strict';

//
// Iterator that takes elements while the predicate returns true.
//
var TakeWhileIterator = function (iterator, predicate) {

	var self = this;
	self._taking = true;
	self._iterator = iterator;
	self._predicate = predicate;
};

module.exports = TakeWhileIterator;

TakeWhileIterator.prototype.moveNext = function () {

	var self = this;
	if (!self._taking) {
		return false;
	}

	if (!self._iterator.moveNext()) {
		return false;
	}

	if (!self._predicate(self._iterator.getCurrent())) {
		self._taking = false;
		return false;
	}

	return true;
};

TakeWhileIterator.prototype.getCurrent = function () {

	var self = this;
	return self._iterator.getCurrent();
};
