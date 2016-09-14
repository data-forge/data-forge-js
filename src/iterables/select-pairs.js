
'use strict';

var SelectPairsIterable = function (iterable, selector) {
	var self = this;
    self._iterable = iterable;
    self._selector = selector;
};

module.exports = SelectPairsIterable;

var SelectIterator = require('../iterators/select');

SelectPairsIterable.prototype.getIterator = function () {

    var self = this;
    return new SelectIterator(
        self._iterable.getIterator(), 
        function (pair) {
			var newPair = self._selector(pair[1], pair[0]);
			if (!Object.isArray(newPair) || newPair.length !== 2) {
				throw new Error("Expected return value from 'Series.selectPairs' selector to be a pair, that is an array with two items: [index, value].");
			}
			return newPair;			
        }
    );
};

SelectPairsIterable.prototype.getColumnNames = function () {

    var self = this;

    // Have to get the first element to get field names.
    var iterator = self._iterable.getIterator();
    if (!iterator.moveNext()) {
        return [];
    }

    var firstPair = iterator.getCurrent();
    var transformed = self._selector(firstPair[1], firstPair[0]); // Extract value and get fields.
    return Object.keys(transformed[1]); 
};
