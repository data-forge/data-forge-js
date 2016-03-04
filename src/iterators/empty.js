'use strict';

/*
 * Defines an empty iterator.
 */

var EmptyIterator = function () {

	var self = this;

	self.moveNext = function () {
		return false;
	};

	self.getCurrent = function () {
		return undefined;
	};

};

module.exports = EmptyIterator;