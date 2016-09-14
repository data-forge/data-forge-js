'use strict';

var SkipIterable = function (iterable, amount) {
	var self = this;
    self._iterable = iterable;
    self._amount = amount;
};

module.exports = SkipIterable;

var SkipIterator = require('../iterators/skip');

SkipIterable.prototype.getIterator = function () {
    var self = this;
    return new SkipIterator(self._iterable.getIterator(), self._amount);
};

SkipIterable.prototype.getColumnNames = function () {
    var self = this;
    return self._iterable.getColumnNames();
};
