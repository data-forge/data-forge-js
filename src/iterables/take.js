'use strict';

var TakeIterable = function (iterable, amount) {
	var self = this;
    self._iterable = iterable;
    self._amount = amount;
};

module.exports = TakeIterable;

var TakeIterator = require('../iterators/take');

TakeIterable.prototype.getIterator = function () {
    var self = this;
    return new TakeIterator(self._iterable.getIterator(), self._amount);
};

TakeIterable.prototype.getColumnNames = function () {
    var self = this;
    return self._iterable.getColumnNames();
};
