'use strict';

//
// Module for getting data to the browser via HTTP.
//

module.exports = function (url) {

	return {

		//
		// Invoke HTTP GET to retreive data.
		//
		read: function () {
			return new Promise(function (resolve, reject) {
				$.get(url)
					.done(function (data) {
						resolve(data);
					})
					.fail(function (err) {
						reject(err);
					});
			});
		},

		//
		// Invoke HTTP POST to push data.
		//
		write: function (textData) {
			//todo:
		},

	};
};
