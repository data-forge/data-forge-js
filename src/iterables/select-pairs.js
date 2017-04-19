'use strict';

var SelectPairsIterable = function (iterable, selector) {
	var self = this;
    self._iterable = iterable;
    self._selector = selector;
};

module.exports = SelectPairsIterable;

var SelectIterator = require('../iterators/select');
var E = require('linq');

SelectPairsIterable.prototype.getIterator = function () {

    var self = this;
    return new SelectIterator(
        self._iterable.getIterator(), 
        function (pair) {
			var newPair = self._selector(pair[0], pair[1]);
			if (!Object.isArray(newPair) || newPair.length !== 2) {
				throw new Error("Expected return value from 'Series.selectPairs' selector to be a pair, that is an array with two items: [index, value].");
			}
			return newPair;			
        }
    );
};

SelectPairsIterable.prototype.getColumnNames = function () {

    var self = this;

    var iterator = self._iterable.getIterator();

    // Consider all rows, this expensive, todo: how do I can make this cheaper!
    var pairs = [];
    while (iterator.moveNext()) {
        pairs.push(iterator.getCurrent());
    }
    
    return E.from(pairs)
        .selectMany(function (pair) {
            var transformed = self._selector(pair[0], pair[1]); // Extract value and get fields.
            return Object.keys(transformed[1]);
        })
        .distinct()
        .toArray();
};
