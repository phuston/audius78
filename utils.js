module.exports.modelToState = function(model) {
	var rows = {};
	model.rows.map((row, i) => {
		rows[i] = row;
	});
	return rows;
}