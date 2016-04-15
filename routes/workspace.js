var router = require('express').Router();
var sockets = require('../sockets');
var Workspace = require('../models/workspace');

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
  // Compute real hash for new workspace here
  var hash = generateUUID();
  res.json({"hash": hash});
});

module.exports = router;

