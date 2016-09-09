'use strict';

var PairsIterable = function (indexIterable, valuesIterable) {
    var self = this;
    self._indexIterable = indexIterable;
    self._valuesIterable = valuesIterable; 
};

module.exports = PairsIterable;

var PairIterator = require('../iterators/pair');

PairsIterable.prototype.getIterator = function () {
    var self = this;
    return new PairIterator(
        self._indexIterable.getIterator(), 
        self._valuesIterable.getIterator()
    );
};

PairsIterable.prototype.getColumnNames = function () {
    var self = this;
    return self._valuesIterable.getColumnNames();
};