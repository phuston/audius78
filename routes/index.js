var fs = require('fs');
var multer = require('multer');
var sox = require('sox.js');

var multerHandle = multer({
    dest: 'uploads/',
    limits: {fileSize: 10000000, files: 1}
}).single('song');

module.exports = function(){
    return {
        upload: function(req, res){
            multerHandle(req, res, function(err){
                if( err ){
                    return res.json(err);
                }

                sox([req.file.path, 
                        { bits: 24,
                        rate: 44100,
                        compression: 8},
                        req.file.filename + '.flac'],
                        function(err, outFP){ 
                            if( err ) {
                                return res.json(err);
                                console.error("SOX error");
                            }

                            fs.renameSync(outFP, "static/"+outFP);
                            fs.unlinkSync(req.file.path);
                            return res.json({fd: "static/"+outFP});

                        });
            });
        }
    }
}
