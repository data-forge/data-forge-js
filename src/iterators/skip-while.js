'use strict';

//
// Iterator that skips elements while the predicate returns true.
//
var SkipWhileIterator = function (iterator, predicate) {

	var self = this;
	var skipped = false;
	
	self.moveNext = function () {
		for (;;) {
			if (!iterator.moveNext()) {
				return false;
			}

			if (skipped) {
				// Already skipped.
				return true;
			}

			// Skipping until predict returns false.
			if (!predicate(iterator.getCurrent())) {
				skipped = true;
				return true;
			}
		}
	};

	self.getCurrent = function () {
		return iterator.getCurrent();
	};

};

module.exports = SkipWhileIterator;