'use strict';
var express = require('express'),
router = express.Router(),
knex = require('../db/knex');

router.get('/advanced', function(req, res, next) {

  res.render('advancedSearch');
});

//search?destination=denver&origin=fortcollins
router.get('/search', function(req, res, next) {

  var query = req.query;
  if (Object.keys(query).length === 0) {
    knex('trips')
    .join('users', 'users.id', '=', 'trips.user_id')
    .join('preferences', 'preferences.id', '=', 'trips.preferences_id')
    .select('trips.id AS id', 'profile_pic_url', 'name_first', 'name_last', 'age', 'user_id', 'isFB_verified',
    'start_location', 'end_location', 'date_of', 'details', 'car_img_url', 'car_description', 'trip_cost', 'num_seats')
    .then(function(data) {

      console.log(data);
      res.status(200).render('searchResults', {objects: data, queries: query});
    });
  } else { //search?origin=Denver&destination=Fort%20Collins
    knex('trips')
    .join('users', 'users.id', '=', 'trips.user_id')
    .join('preferences', 'preferences.id', '=', 'trips.preferences_id')
    .select('trips.id AS id', 'profile_pic_url', 'name_first', 'name_last', 'age', 'user_id', 'isFB_verified',
    'start_location', 'end_location', 'date_of', 'details', 'car_img_url', 'car_description', 'trip_cost', 'num_seats')
    .where({
      start_location: query.origin.split(',')[0],
      end_location: query.destination.split(',')[0],
    })
    .whereRaw('CAST(date_of AS DATE) = ?', [query.date])
    .then(function(data) {

      //console.log((new Date(data[0].date_of)).toISOString().split('T')[0]);
      res.status(200).render('searchResults', {objects: data, queries: query});
    });
  }
});

//render form to create new trip
router.get('/newRide', function(req, res, next) {
   res.render('newRide');
 });

//TODO users can create a trip (only users who are fb authenticated & isdriver: yes)
router.post('/', function(req, res, next) {
  var post = req.body;
  console.log(post);

//TODO: add user_id: req.session.user_id when session is created
  knex('trips').insert({
    start_location: post.origin,
    end_location: post.destination,
    details: post.trip_details,
    num_seats: post.num_seats,
    smoking: post.smoking,
    eating: post.eating,
    pets: post.pets,
    music: post.music,
    talking: post.talking,
    car_description: post.car_description,
    car_img_url: post.car_img_url,
    date_of: post.date
  }).returning('id')
  .then(function(id) {
    res.redirect('/trip/' + id[0]);
  }).catch(function(err) {
    console.log(err);
    res.sendStatus(500);
  });
});

router.get('/:id', function(req, res, next) {

  knex('trips')
  .join('users', 'users.id', '=', 'trips.user_id')
  .select()
  .where('trips.id', '=', req.params.id)
  .then(function(data) {

    console.log(data);
    res.render('showRide', data[0]);
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
      res.redirect('/trip/' + req.params.id);
    });
  });
});






module.exports = router;
