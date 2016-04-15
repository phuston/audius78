var router = require('express').Router();
var sockets = require('../sockets');
/*
POST a new article. Creates a new Article model object
using relevant information received from the NYTimes API.
Then it finds the user, and pushes the new article's id onto
user.article.
*/
router.get('/create', function(req, res, next) {
  // Compute real hash for new workspace here
  var hash = 'UDIU78';
  res.send(hash);
});

module.exports = router;

