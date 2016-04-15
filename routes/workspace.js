var router = require('express').Router();
var sockets = require('../sockets');
var Workspace = require('../models/workspace');
var defaultWorkspace = require('../models/defaultWorkspace');

function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random()*16)%16 | 0;
    d = Math.floor(d/16);
    return (c=='x' ? r : (r&0x3|0x8)).toString(16);
  });
  return uuid;
};

router.post('/create', function(req, res, next) {
  // Compute real hash for new workspace here}
  var hash = generateUUID();
  var newWorkspace = Object.assign(defaultWorkspace);
  newWorkspace.id = hash;
  Workspace.create(newWorkspace, function (err, workspace) {
    if (err) {
      return console.log(err);
    }

    res.json({hash: hash, workspace: workspace});
  });
});

router.post('/load', function(req, res, next) {
  Workspace.findOne({'id': req.body.id}, function(err, workspace) {
    if (err) {
      return console.error(err);
    }

    res.json({'workspace': workspace});
  })
});

module.exports = router;

