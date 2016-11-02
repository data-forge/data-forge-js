'use strict';

/*
 * Defines an empty iterator.
 */

var EmptyIterator = function () {
};

module.exports = EmptyIterator;

EmptyIterator.prototype.moveNext = function () {
	return false;
};

EmptyIterator.prototype.getCurrent = function () {
	return undefined;
};

