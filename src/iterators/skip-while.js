'use strict';

//
// Iterator that skips elements while the predicate returns true.
//
var SkipWhileIterator = function (iterator, predicate) {

	var self = this;
	self._skipped = false;
	self._iterator = iterator;
	self._predicate = predicate;
};

module.exports = SkipWhileIterator;

SkipWhileIterator.prototype.moveNext = function () {

	var self = this;
	for (;;) {
		if (!self._iterator.moveNext()) {
			return false;
		}

		if (self._skipped) {
			// Already skipped.
			return true;
		}

		// Skipping until predict returns false.
		if (!self._predicate(self._iterator.getCurrent())) {
			self._skipped = true;
			return true;
		}
	}
};

SkipWhileIterator.prototype.getCurrent = function () {
	
	var self = this;
	return self._iterator.getCurrent();
};