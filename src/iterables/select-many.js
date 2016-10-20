
'use strict';

var SelectManyIterable = function (iterable, selector) {
	var self = this;
    self._iterable = iterable;
    self._selector = selector;
};

module.exports = SelectManyIterable;

var SelectManyIterator = require('../iterators/select-many');
var Series = require('../series');
var DataFrame = require('../dataframe');

SelectManyIterable.prototype.getIterator = function () {

    var self = this;
    return new SelectManyIterator(
        self._iterable.getIterator(), 
        function (pair) {
            var newValues = self._selector(pair[1]);
            if (!Object.isArray(newValues) &&
                !(newValues instanceof Series) &&
                !(newValues instanceof DataFrame)) {
                throw new Error("Expected return value from 'Series.selectMany' selector to be an array, a Series or a DataFrame, each item in the data sequence represents a new value in the resulting series.");
            }

            if (newValues instanceof Series)
            {
                newValues = newValues.toArray();
            }

            var newPairs = [];
            for (var newValueIndex = 0; newValueIndex < newValues.length; ++newValueIndex) {
                newPairs.push([pair[0], newValues[newValueIndex]]);
            }

            return newPairs;
        }
    );
};

SelectManyIterable.prototype.getColumnNames = function () {

    var self = this;

    // Have to get the first element to get field names.
    var iterator = self._iterable.getIterator();

    for (;;) { // Keep going until we find a non-empty list.

        if (!iterator.moveNext()) {
            return [];
        }

        var result = self._selector(iterator.getCurrent()[1]);
        if (result.length > 0) {
            return Object.keys(result[0]);
        }
    } 
};
