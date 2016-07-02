'use strict';
var express = require('express'),
    router = express.Router(),
    knex = require('../db/knex');

router.get('/', function(req, res, next) {

  var query = req.query;
  console.log(query);
  knex('trips')
  .join('users', 'users.id', '=', 'trips.user_id')
  .select().then(function(data) {

    console.log(data);
    res.status(200).render('searchResults', {objects: data, queries: query});
  });
});

router.post('/reserve/:id', function(req, res, next) {
  
});

module.exports = router;
