var mongoose = require("mongoose") ;

var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var workspacesSchema = mongoose.Schema({
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


module.exports = mongoose.model('Workspace', workspaceSchema);
