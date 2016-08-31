'use strict';

//
// Iterator that takes elements while the predicate returns true.
//
var TakeWhileIterator = function (iterator, predicate) {

	var self = this;
	var taking = true;

	self.moveNext = function () {
		if (!taking) {
			return false;
		}

		if (!iterator.moveNext()) {
			return false;
		}

		if (!predicate(iterator.getCurrent())) {
			taking = false;
			return false;
		}

		return true;
	};

	self.getCurrent = function () {
		return iterator.getCurrent();
	};

};

module.exports = TakeWhileIterator;