'use strict';

var express = require('express');
var app = express();
var router = express.Router();
var knex = require('../db/knex');
var bcrypt = require('bcrypt');



router.get('/', function(req, res) {
  //console.log(req.session);

  fbUserExistsInOurDatabase(req.session, req, res);

  res.render('index', {
    hasError: false,
    origin: '',
    destination: '',
    date: ''
  });
});

function fbUserExistsInOurDatabase(data, req, res) {
  console.log('1. Checking for facebook login...');
  if (data.passport) { //if the user is logged in with Facebook
    console.log('2. User is logged in with FB');
    var name = data.passport.user.displayName;
    var nameArray = name.split(' ');

    // FACEBOOK LOGIN ISSUE BELOW?

    exists(name).then(function(result) {

      if(result.length >= 1) { // CHANGED TO >= to encapsulate more cases
        console.log('3. The user exists in our database! Hooray!');
        console.log('TADA', result);
        //req.session = {};
        req.session.user_name = result.username;
        req.session.user_id = result.id;

      } else {
        console.log('3. User does not exist in our database');
        console.log('4. FB user needs to be added to our database');
        //  1. Direct user to page to fill out remaining information EXCLUDING:
        // 		--password, name_first, name_last
        //res.redirect('/login');
        //  2. Insert a new user with that information
        // 	3. set isFB_verified to true
      }
    });
  } else {
    console.log('2. User not logged in via facebook');
  }
}

function exists(name) {
  var nameArray = name.split(' ');
  return knex.select('*').from('users').where({name_first: nameArray[0], name_last: nameArray[1]});
}


router.post('/index', function(req, res) {
  console.log(req.body);

  var info = {
    hasError: false,
    origin: req.body.origin,
    destination: req.body.destination,
    date: req.body.date
  };

  info.error = {};
  checkRequired(req, info);

  if (!info.hasError) {
    console.log(info);
    res.redirect('/trip/search?origin=' + req.body.origin + '&destination=' + req.body.destination + '&date=' + req.body.date);
  } else {
    console.log(info);
    // If there are validation errors, re-render the signup page, injecting the users previous inputs.
    res.render('index', {info: info});
  }

});

//checking everything is filled out
function checkRequired(req, info) {
  for (var item in req.body) {
    info[item] = req.body[item];

    if (req.body[item].length <= 0) {
      // TODO: ask how this code works (wouldn't work unless this existed, taken out of the previous if would print empty arrays in error object)
      if (!info.error[item]) {
        info.error[item] = [];
      }
      info.hasError = true;
      info.error[item].push(
        item + ' is required.'
      );
    }
  }
}

router.get('/login', function(req, res) {
  res.render('login');
});

router.get('/logout', function(req, res, next) {

  req.session = null;
  res.redirect('/');
});

//TODO: compare with bcrypt here
router.post('/auth', function(req, res, next) {
  var info = {
    user: req.body.username
  };

  knex('users').select('username', 'password', 'id').where({
    username: req.body.username
  }).then(function(data) {
    // this if works
    console.log(data);
    if (data.length === 1) {
      bcrypt.compare(req.body.password, data[0].password, function(err, result) {
        if (result) {
          //req.session = {};
          req.session.user_id = data[0].id;
          req.session.user_name = data[0].username;
          console.log(req.session);
          res.redirect('/');
        } else {
          //if password and username don't match
          info.noMatch = true;
          res.render('login', {
            info: info
          });
        }
      });
    } //TODO: output on same page with same message in error format
    else {
      info.noUser = true;
      res.render('login', {
        info: info
      });
    }
  }).catch(next);
});


module.exports = router;
