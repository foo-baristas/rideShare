'use strict';
var express = require('express'),
    router = express.Router(),
    knex = require('../db/knex');

router.get('/', function(req, res, next) {

  var query = req.query;
  console.log(query);
  knex('trips').select().then(function(data) {

    //console.log(data);
    res.status(200).render('searchResults', {objects: data});
  });
});

module.exports = router;
