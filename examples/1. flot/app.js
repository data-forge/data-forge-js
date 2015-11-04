'use strict'

$(function() {
	
	//
	// Helper function for plotting.
	//
	var plot = function (id, dataFrame) {
		var flotSeries = E.from(dataFrame.columns())
			.select(function (columnName) {
				return {
					label: columnName,
					data: dataFrame.series(columnName).rows(),
				};
			})
			.toArray();
		
		$.plot(id, flotSeries);
	};
	
	// 
	// Create a data frame.
	//
	var index = new panjas.NumberIndex(E.range(0, 14).toArray());
	var values = E
		.range(0, 14)
		.select(function (i) {
			return [Math.sin(i), Math.cos(i)];
		})
		.toArray();

	var dataFrame = new panjas.DataFrame(["Sin", "Cos"], index, values);
	
	//
	// Plot the data frame.
	//
	plot('#placeholder', dataFrame);
});