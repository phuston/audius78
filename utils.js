module.exports.modelToState = function(model) {
	var rows = {};
	model.rows.map((row, i) => {
		rows[i] = row;
	});
	rows.length = model.rows.length;
	return rows;
}