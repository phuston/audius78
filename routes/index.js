var fs = require('fs');
var multer = require('multer');
var sox = require('sox.js');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var Workspace = require('../models/workspace');

var multerHandle = multer({
  dest: 'uploads/',
  limits: {fileSize: 10000000, files: 1}
}).single('file');

module.exports = function(){
  return {
    upload: function(req, res){
      multerHandle(req, res, function(err){
        if( err ){
          console.error('Multer failure');
          return res.status(500).json(err);
        }
        console.log('req.body', req.body);
        console.log('workspace', req.body.workspaceId);

        var extension =
        fs.renameSync(req.file.path, req.file.path+req.file.originalname);

        console.log(req.file);
        sox([req.file.path+req.file.originalname, 
            req.file.filename + '.ogg'],
            function(err, outFP){ 
              console.log(outFP);
              if( err ) {
                console.error("Sox Warning: ", err);
              }
              fs.exists(outFP, function(exists){
                if( !exists ){
                  console.error('file does not exist');
                  return res.status(500).json({ error: "Error with uploading!" });
                }

                fs.rename(outFP, "static/"+outFP, function(err){
                  if( err ){
                    console.error("Rename error");
                    return res.status(500).json(err);
                  }
                  fs.unlink(req.file.path, function(err){
                    if( err ){
                      console.error("Unlink error");
                      return res.status(500).json(err);
                    }
                    console.log("Uploaded file "+outFP);

                    var rowId = new ObjectId();
                    var newRow = {
                      _id: rowId,
                      rawAudio: outFP,
                      audioBlocks: [{
                        file_end: undefined,
                        row_offset: 0,
                        file_offset: 0,
                        flags: []
                      }],
                    }

                    Workspace.findOneAndUpdate(
                      {id: req.body.workspaceId},
                      {$push: {rows: newRow}},
                      {safe: true, upsert: false},
                      function(err, workspace) {
                        if (err) {
                          res.status(500).json(err);
                        } else {
                          console.log("ROWID", rowId);
                          res.json({rowId: rowId});
                        }
                      }
                    );
                  });
                });
              });
            });
      });
    }
  }
}
