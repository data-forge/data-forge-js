'use strict';

var WhereIterable = function (iterable, predicate) {
	var self = this;
    self._iterable = iterable;
    self._predicate = predicate;
};

module.exports = WhereIterable;

var WhereIterator = require('../iterators/where');

WhereIterable.prototype.getIterator = function () {
    var self = this;
    return new WhereIterator(self._iterable.getIterator(), self._predicate);
};

WhereIterable.prototype.getColumnNames = function () {
    var self = this;
    return self._iterable.getColumnNames();
};
