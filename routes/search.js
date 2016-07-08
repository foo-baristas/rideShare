'use strict';
var express = require('express'),
router = express.Router(),
knex = require('../db/knex');

router.get('/search', function(req, res, next) {

  var query = req.query;
  console.log(query);

  if (Object.keys(query).length === 0) { //select all
    knex('trips')
    .join('users', 'users.id', '=', 'trips.user_id')
    .join('preferences', 'preferences.id', '=', 'trips.preferences_id')
    .select('trips.id AS id', 'profile_pic_url', 'name_first', 'name_last', 'age', 'user_id', 'isFB_verified',
    'start_location', 'end_location', 'date_of', 'details', 'car_img_url', 'car_description', 'trip_cost', 'num_seats',
    'isSmoking', 'isPets', 'isTalking', 'isFood', 'isMusic')
    .then(function(data) {
      res.status(200).render('searchResults', {objects: data, queries: query});
    });
  }
  else if(query.seats) { //select with advanced search params
    knex('trips')
    .join('users', 'users.id', '=', 'trips.user_id')
    .join('preferences', 'preferences.id', '=', 'trips.preferences_id')
    .select('trips.id AS id', 'profile_pic_url', 'name_first', 'name_last', 'age', 'user_id', 'isFB_verified',
    'start_location', 'end_location', 'date_of', 'details', 'car_img_url', 'car_description', 'trip_cost', 'num_seats',
    'isSmoking', 'isPets', 'isTalking', 'isFood', 'isMusic')
    .where(!query.any ? {
      start_location: query.origin.split(',')[0],
      end_location: query.destination.split(',')[0],
      isSmoking: (query.smoking ? true : false) | false,
      isPets: (query.pets ? true : false) | false,
      isTalking: (query.talking ? true : false) | false,
      isFood: (query.eating ? true : false) | false,
      isMusic: (query.music ? true : false) | false
    } : {

      start_location: query.origin.split(',')[0],
      end_location: query.destination.split(',')[0]
    })
    .whereRaw('CAST(date_of AS DATE) = ?', [query.date])
    .where('trip_cost', '<=', query.maxprice || 9999)
    .where('num_seats', '>=', query.seats || 1)
    .then(function(data) {
      res.status(200).render('searchResults', {objects: data, queries: query});
    });
  }
  else { //select with city, city, date
    knex('trips')
    .join('users', 'users.id', '=', 'trips.user_id')
    .join('preferences', 'preferences.id', '=', 'trips.preferences_id')
    .select('trips.id AS id', 'profile_pic_url', 'name_first', 'name_last', 'age', 'user_id', 'isFB_verified',
    'start_location', 'end_location', 'date_of', 'details', 'car_img_url', 'car_description', 'trip_cost', 'num_seats',
    'isSmoking', 'isPets', 'isTalking', 'isFood', 'isMusic')
    .where({
      start_location: query.origin.split(',')[0],
      end_location: query.destination.split(',')[0]
    })
    .whereRaw('CAST(date_of AS DATE) = ?', [query.date])
    .where('trip_cost', '<=', query.maxprice || 9999)
    .where('num_seats', '>=', query.seats || 1)
    .then(function(data) {
      res.status(200).render('searchResults', {objects: data, queries: query});
    });
  }
});

//render form to create new trip
router.get('/newRide', function(req, res, next) {
  res.render('newRide');
});

router.get('/advanced', function(req, res, next) {
  res.render('advancedSearch');
});

function joinPartsAsDate(dateParts, timeParts) {

  dateParts = dateParts.split('-');
  timeParts = timeParts.split(':');

  if (dateParts && dateParts.length === 3 && timeParts && timeParts.length === 2) {

    dateParts[1] -= 1;
    return new Date(Date.UTC.apply(undefined, dateParts.concat(timeParts)));
  } else {
    return 'NOPE: ' + dateParts.length + ' :: ' + timeParts.length;
  }
}


//TODO users can create a trip (only users who are fb authenticated & isdriver: yes)
//WORKING
router.post('/', function(req, res, next) {
  var post = req.body;
  console.log(post);
  console.log(joinPartsAsDate(post.date, post.time));

  knex('preferences').insert({

    isSmoking: (post.smoking ? true : false) | false,
    isPets: (post.pets ? true : false) | false,
    isTalking: (post.talking ? true : false) | false,
    isFood: (post.eating ? true : false) | false,
    isMusic: (post.music ? true : false) | false,
    luggage_size: 'None',
    luggage_num: 1
  })
  .returning('id')
  .then(function(data) {

    console.log('Da preferences id', data[0]);
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
      date_of: joinPartsAsDate(post.date, post.time),
      user_id: req.session.user_id[0],
      preferences_id: data[0],
      trip_cost: post.trip_cost
    }).returning('id')
    .then(function(id) {
      res.redirect('/trip/' + id[0]);
    }).catch(function(err) {
      console.log(err);
      res.sendStatus(500);
    });
  });
});

router.get('/:id', function(req, res, next) {

  // console.log('How: ' + req.params.id);
  if (isNaN(req.params.id)) return;

  knex('trips')
  .join('users', 'users.id', '=', 'trips.user_id')
  .join('preferences', 'preferences_id', '=', 'trips.preferences_id')
  .select()
  .where('trips.id', '=', req.params.id)
  .then(function(data) {

    console.log('QUERY', data);
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
