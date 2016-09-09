'use strict';

var ArrayIterable = function (arr) {
    var self = this;
    self._arr = arr;
};

module.exports = ArrayIterable;

var ArrayIterator = require('../iterators/array');

ArrayIterable.prototype.getIterator = function () {
    var self = this;
    return new ArrayIterator(self._arr);
};

ArrayIterable.prototype.getColumnNames = function () {
    var self = this;
    if (self._arr.length <= 0) {
        return [];
    }
    
    return Object.keys(self._arr);
};