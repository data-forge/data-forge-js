
'use strict';

var SelectValuesIterable = function (iterable, selector) {
	var self = this;
    self._iterable = iterable;
    self._selector = selector;
};

module.exports = SelectValuesIterable;

var SelectIterator = require('../iterators/select'); //todo: could use a special iterator for this.

SelectValuesIterable.prototype.getIterator = function () {

    var self = this;
    return new SelectIterator(
        self._iterable.getIterator(), 
        function (pair) {
            return [pair[0], self._selector(pair[1])]; // Extract the value.
        }
    );
};

SelectValuesIterable.prototype.getColumnNames = function () {

    var self = this;

    // Have to get the first element to get field names.
    var iterator = self._iterable.getIterator();
    if (!iterator.moveNext()) {
        return [];
    }

    return Object.keys(self._selector(iterator.getCurrent()[1])); // Extract value and get fields.
};
