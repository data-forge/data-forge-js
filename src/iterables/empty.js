'use strict';

var EmptyIterable = function () {
};

module.exports = EmptyIterable;

var EmptyIterator = require('../iterators/empty');

EmptyIterable.prototype.getIterator = function () {
    return new EmptyIterator();
};

EmptyIterable.prototype.getColumnNames = function () {
    return [];
};