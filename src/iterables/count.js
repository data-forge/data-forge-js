'use strict';

var CountIterable = function () {
};

module.exports = CountIterable;

var CountIterator = require('../iterators/count');

CountIterable.prototype.getIterator = function () {
    return new CountIterator();
};

CountIterable.prototype.getColumnNames = function () {
    return [];
};