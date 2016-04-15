var mongoose = require("mongoose");
var findOrCreate = require('mongoose-findorcreate');

var Schema = mongoose.Schema;

var workspaceSchema = mongoose.Schema({
  _id: {type: String},
  rows: [{
    rowId: String,
    rawAudio: String,
    audioBlocks: [{
      length: Number,
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

workspaceSchema.plugin(findOrCreate);

module.exports = mongoose.model('Workspace', workspaceSchema);
