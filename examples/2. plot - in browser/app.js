'use strict'

$(function() {
	
	//
	// Helper function for plotting.
	//
	var plot = function (id, indexColumnName, dataFrame) {
		var index = dataFrame.getSeries(indexColumnName).toValues();
		var remainingColumns = dataFrame.dropColumn(indexColumnName).getColumns();

		var flotSeries = E.from(remainingColumns)
			.select(function (column) {
				var name = column.name;
				var data = E.from(index)
					.zip(column.series.toValues(), function (index, value) {
						return [index, value];
					})
					.toArray();
				
				return {
					label: name,
					data: data,
				};
			})
			.toArray();
		
		$.plot(id, flotSeries);
	};
	
	// 
	// Create a simple data frame.
	//
	var values = E
		.range(0, 14)
		.select(function (i) {
			return [i, Math.sin(i), Math.cos(i)];
		})
		.toArray();

	var dataFrame = new dataForge.DataFrame({
			columnNames: ["index", "Sin", "Cos"], 
			rows: values
		});
	
	//
	// Plot the data frame.
	//
	plot('#placeholder', "index", dataFrame);
});
