var router = require('express').Router();
var sockets = require('../sockets');

router.post('/create', function(req, res, next) {
  // Compute real hash for new workspace here
  var hash = 'UDIU78';
  res.json({"hash": hash});
});

module.exports = router;

