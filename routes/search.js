'use strict';
var express = require('express'),
router = express.Router(),
knex = require('../db/knex');

//search?destination=denver&origin=fortcollins
router.get('/', function(req, res, next) {

  var query = req.query;
  console.log(query);
  knex('trips')
  .join('users', 'users.id', '=', 'trips.user_id')
  .join('preferences', 'preferences.id', '=', 'trips.preferences_id')
  .select().then(function(data) {

    console.log(data);
    res.status(200).render('searchResults', {objects: data, queries: query});
  });
});

router.post('/reserve/:id', function(req, res, next) {

  knex('passengers')
  .insert({
    trip_id: req.params.id,
    user_id: req.session.user_id //TODO: modify after session cookies are implemented : req.session.user_id
  }).then(function(data) {

    console.log(data);
    knex('trips')
    .where('id', '=', req.params.id)
    .decrement('num_seats', 1)
    .then(function(data) {
      res.redirect('/search');
    });
  });
});

module.exports = router;
