var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var workspaceSchema = mongoose.Schema({
  id: {type: String},
  rows: [{
    rowId: Number,
    rawAudio: String,
    audioBlocks: [{
      length: Number, // seconds
      row_offset: Number,
      file_offset: Number,
      flags: [{
        start_time: Number,
        duration: Number,
        type: String
      }]
    }]
  }]
});

module.exports = mongoose.model('Workspace', workspaceSchema);
