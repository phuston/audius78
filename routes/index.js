var fs = require('fs');
var multer = require('multer');
var sox = require('sox.js');
var workspaceSchema = require('../models/workspace');

var multerHandle = multer({
  dest: 'uploads/',
  limits: {fileSize: 10000000, files: 1}
}).single('file');

module.exports = function(){
  return {
    upload: function(req, res){
      console.log(req.body);
      multerHandle(req, res, function(err){
        if( err ){
          console.error('Multer failure');
          return res.status(500).json(err);
        }

        console.log(req.file);

        sox([req.file.path, 
            req.file.filename + '.ogg'],
            function(err, outFP){ 
              console.log(outFP);
              if( err ) {
                console.error("SOX error", err);
              }
              fs.exists(outFP, function(exists){
                if( !exists ){
                  console.error('file does not exist');
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
                    return res.json({fd: "static/"+outFP});
                  });
                });
              });
            });
      });
    }
  }
}
