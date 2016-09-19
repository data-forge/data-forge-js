
'use strict';

var SelectManyPairsIterable = function (iterable, selector) {
	var self = this;
    self._iterable = iterable;
    self._selector = selector;
};

module.exports = SelectManyPairsIterable;

var SelectManyIterator = require('../iterators/select-many');
var Series = require('../series');
var DataFrame = require('../dataframe');

SelectManyPairsIterable.prototype.getIterator = function () {

    var self = this;
    return new SelectManyIterator(
        self._iterable.getIterator(), 
        function (pair) {
            var newPairs = self._selector(pair[0], pair[1]);
            if (!Object.isArray(newPairs)) {
                throw new Error("Expected return value from 'Series.selectManyPairs' selector to be an array of pairs, each item in the array represents a new pair in the resulting series.");
            }

            for (var pairIndex = 0; pairIndex < newPairs.length; ++pairIndex) {
                var newPair = newPairs[pairIndex];
                if (!Object.isArray(newPair) || newPair.length !== 2) {
                    throw new Error("Expected return value from 'Series.selectManyPairs' selector to be am array of pairs, but item at index " + pairIndex + " is not an array with two items: [index, value].");
                }
            }

            return newPairs;
        }
    );
};

SelectManyPairsIterable.prototype.getColumnNames = function () {

    var self = this;

    // Have to get the first element to get field names.
    var iterator = self._iterable.getIterator();

    for (;;) { // Keep going until we find a non-empty list.

        if (!iterator.moveNext()) {
            return [];
        }

        var pair = iterator.getCurrent();
        var result = self._selector(pair[0], pair[1]);
        if (result.length > 0) {
            return Object.keys(result[0][1]); // Extract pair value.
        }
    } 
};
