'use strict';

var TakeWhileIterable = function (iterable, predicate) {
	var self = this;
    self._iterable = iterable;
    self._predicate = predicate;
};

module.exports = TakeWhileIterable;

var TakeWhileIterator = require('../iterators/take-while');

TakeWhileIterable.prototype.getIterator = function () {
    var self = this;
    return new TakeWhileIterator(self._iterable.getIterator(), self._predicate);
};

TakeWhileIterable.prototype.getColumnNames = function () {
    var self = this;
    return self._iterable.getColumnNames();
};
