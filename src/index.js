'use strict';

/**
 * Constructor for Index.
 * @constructor
 * @extends dataForge.Series
 * @memberof dataForge
 * @param {object|array} config|values - Specifies content and configuration for the Index.
 */
var Index = function (config) {

	var self = this;
    if (!self.Constructor) {
	    self.Constructor = Index;        
    }

    Series.call(this, config);
};

module.exports = Index;

var inherit = require('./inherit');
var Series = require('./series');
var parent = inherit(Index, Series);
var moment = require('moment');

/**
 * Get the type of the index.
 * 
 * @returns {string} Returns a string that specifies the type of the index.
 */
Index.prototype.getType = function () {

    var self = this;

    if (!self._type) {
        //
        // Detect the type.
        //
        if (self.any()) {
            var firstValue = self.first();
            if (Object.isNumber(firstValue)) {
                self._type = 'number';
            }
            else if (Object.isString(firstValue)) {
                self._type = 'string';
            }
            else if (firstValue instanceof Date) {
                self._type = 'date';
            }
            else {
                self._type = 'unsupported';
            }
        }
        else {
            self._type = 'empty';
        }
    }

    return self._type;
};

/**
 * Get the less than operation for the index.
 * 
 * @returns {function} Returns a function that can be used to compare a value against an index value.
 */
Index.prototype.getLessThan = function () {

    var self = this;

    switch (self.getType()) {
        case "date":
            return function (d1, d2) {
                return moment(d1).isBefore(d2);
            };

        case "string":
        case "number":
            return function (v1, v2) {
                return v1 < v2;
            };

        case "empty":
            return function () {
                return true; // Series is empty, so this makes no difference.
            };

        default:
            throw new Error("No less than operation available for type: " + self.getType());
    }
};

/**
 * Get the greater than operation for the index.
 * 
 * @returns {function} Returns a function that can be used to compare a value against an index value.
 */
Index.prototype.getGreaterThan = function () {

    var self = this;

    switch (self.getType()) {
        case "date":
            return function (d1, d2) {
                return moment(d1).isAfter(d2);
            };

        case "string":
        case "number":
            return function (v1, v2) {
                return v1 > v2;
            };

        case "empty":
            return function () {
                return true; // Series is empty, so this makes no difference.
            };

        default:
            throw new Error("No greater than operation available for type: " + self.getType());
    }
};




