'use strict';
var express = require('express'),
router = express.Router(),
knex = require('../db/knex');

//search?destination=denver&origin=fortcollins
router.get('/search', function(req, res, next) {

  var query = req.query;
  if (Object.keys(query).length === 0) {
    knex('trips')
    .join('users', 'users.id', '=', 'trips.user_id')
    .join('preferences', 'preferences.id', '=', 'trips.preferences_id')
    .select()
    .then(function(data) {

      console.log(data);
      res.status(200).render('searchResults', {objects: data, queries: query});
    });
  } else { //search?origin=Denver&destination=Fort%20Collins
    knex('trips')
    .join('users', 'users.id', '=', 'trips.user_id')
    .join('preferences', 'preferences.id', '=', 'trips.preferences_id')
    .select()
    .where({
      start_location: query.origin,
      end_location: query.destination
    })
    .then(function(data) {

      console.log(data);
      res.status(200).render('searchResults', {objects: data, queries: query});
    });
  }
});

router.get('/:id', function(req, res, next) {

  knex('trips')
  .select()
  .where('id', '=', req.params.id)
  .then(function(data) {

    res.render('showRide', { tripInfo: data });
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
