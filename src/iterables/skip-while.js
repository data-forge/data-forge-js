'use strict';

var SkipWhileIterable = function (iterable, predicate) {
	var self = this;
    self._iterable = iterable;
    self._predicate = predicate;
};

module.exports = SkipWhileIterable;

var SkipWhileIterator = require('../iterators/skip-while');

SkipWhileIterable.prototype.getIterator = function () {
    var self = this;
    return new SkipWhileIterator(self._iterable.getIterator(), self._predicate);
};

SkipWhileIterable.prototype.getColumnNames = function () {
    var self = this;
    return self._iterable.getColumnNames();
};
