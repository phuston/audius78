var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var workspaceSchema = mongoose.Schema({
  id: {type: String},
  rows: [{
    name: String,
    rowId: Number,
    rawAudio: String,
    gain: Number,
    audioBlocks: [{
      file_end: Number,
      row_offset: Number,
      file_offset: Number,
      flags: []
    }]
  }]
});

module.exports = mongoose.model('Workspace', workspaceSchema);
