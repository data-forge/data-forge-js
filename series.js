'use strict';

//
// Implements a time series data structure.
//

var assert = require('chai').assert;
var E = require('linq'); 

var Series = function (entries) {
	assert.isArray(entries, "Expected parameter 'entries' to be an array.");
	
	var self = this;
	self._entries = entries;	
};

Series.prototype.index = function () {
	var self = this;
	return E.from(self._entries)
		.select(function (entry) {
			return entry[0];
		})
		.toArray();
};

Series.prototype.values = function () {
	var self = this;
	return E.from(self._entries)
		.select(function (entry) {
			return entry[1];
		})
		.toArray();
};

module.exports = Series;