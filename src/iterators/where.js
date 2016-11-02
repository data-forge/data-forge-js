'use strict';

//
// Iterate that filters elements based on a predicate.
//
var WhereIterator = function (iterator, predicate) {

	var self = this;
	self._iterator = iterator;
	self._predicate = predicate;	
};

module.exports = WhereIterator;

WhereIterator.prototype.moveNext = function () {

	var self = this;

	for (;;) {
		if (!self._iterator.moveNext()) {
			return false;
		}

		// Skipping until predict returns false.
		if (self._predicate(self._iterator.getCurrent())) {
			return true;
		}
	}
};

WhereIterator.prototype.getCurrent = function () {
	var self = this;
	return self._iterator.getCurrent();
};

//
// Bake the iterator into an array.
//
WhereIterator.prototype.realize = function () {

	var self = this;

	var output = [];

	while (self.moveNext()) {
		output.push(self.getCurrent());
	}

	return output;
};
