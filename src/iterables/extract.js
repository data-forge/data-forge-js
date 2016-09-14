'use strict';

var ExtractIterable = function (iterable, arrayIndex) {
	var self = this;
    self._iterable = iterable;
    self._arrayIndex = arrayIndex;
};

module.exports = ExtractIterable;

var SelectIterator = require('../iterators/select');

ExtractIterable.prototype.getIterator = function () {

    var self = this;
    return new SelectIterator(
        self._iterable.getIterator(), 
        function (arr) {
            return arr[self._arrayIndex];
        }
    );
};

ExtractIterable.prototype.getColumnNames = function () {

    var self = this;
    return self._iterable.getColumnNames();
};
