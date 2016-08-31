'use strict';

//
// Iterate that filters elements based on a predicate.
//
var WhereIterator = function (iterator, predicate) {

	var self = this;
	
	self.moveNext = function () {
		for (;;) {
			if (!iterator.moveNext()) {
				return false;
			}

			// Skipping until predict returns false.
			if (predicate(iterator.getCurrent())) {
				return true;
			}
		}
	};

	self.getCurrent = function () {
		return iterator.getCurrent();
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

module.exports = WhereIterator;