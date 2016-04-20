module.exports.modelToState = function(model) {
	var rows = {};
	model.rows.map((row, i) => {
		rows[i] = row;
	});
	rows.length = model.rows.length;
	console.log(typeof rows);
	return rows;
}

module.exports.playingMode = Object.freeze({ PLAYING: 0, PAUSE: 1, STOP: 2 });
