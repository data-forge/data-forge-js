'use strict';

var assert = require('chai').assert; 

//
// Represents a sequence of index/value pairs as returned by the asPairs fn.
//

var Pairs = function (config, valuesConstructor) {

    assert.isObject(config, "Expected 'config' parameter to be a function.")
    assert.isFunction(valuesConstructor, "Expected 'valuesConstructor' parameter to be a factory function.");

	var self = this;
	self.factory = function (config) {
        return new Pairs(config, valuesConstructor);
    };
    self._ValuesConstructor = valuesConstructor;

    Series.call(this, config);
};

module.exports = Pairs;

var Series = require('./series');
var inherit = require('./inherit');
var parent = inherit(Pairs, Series);

var SelectPairsIterable = require('../src/iterables/select-pairs');

/** 
 * Convert a series of pairs to back to a series of values.
 * 
 * @returns {Series} Returns a series of values where each pair has been extracted from the value of the input series.
 */
Pairs.prototype.asValues = function () {

	var self = this;
	return self._ValuesConstructor({
		iterable: new SelectPairsIterable(
			self,
			function (index, value) {
				return [value[0], value[1]];
			}
		)
	});
};
