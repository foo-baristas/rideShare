'use strict';

var express = require('express');
var app = express();
var router = express.Router();
var knex = require('../db/knex');
var bcrypt = require('bcrypt');



router.get('/', function(req, res) {
  //console.log(req.session);
  // Check if FB-logged-in-user exists in database
  fbUserExistsInOurDatabase(req.session, res);


  //console.log('LOCALLY: ', res.locals.user_id);
  //console.log(req.session);

  res.render('index', {
    hasError: false,
    origin: '',
    destination: '',
    date: ''
  });
});

function fbUserExistsInOurDatabase(data, res) {
  console.log("1. Checking for facebook login...");
  if (data.passport) {
    console.log("2. User is logged in with FB");
    var name = data.passport.user.displayName;
    if(exists(name) === true) {
      console.log("FB user in confirmed as a user in our database");
    } else {
      console.log("4. FB user needs to be added to our database");
      //res.redirect("/user/new");
      //return false;
    }
  } else {
    console.log("2. User not logged in via facebook");
  }
  // If (session.passport.displayName && session.passport.displayName !== any user names in our database) {
  //
  // direct user to page to fill out remaining information EXCLUDING:
  // 		--password
  // 		--name_first
  // 		--name_last
  //  2. Insert a new user with that information
  // 	3. set isFB_verified to true
  // }

}

//turn into promise
//create firstName, lastName variables
function exists(name) {
  var nameArray = name.split(' ');
  //console.log(nameArray);
  knex.select('*').from('users').where({name_first: nameArray[0], name_last: nameArray[1]}).then(function(result) {
        //console.log(result.length);
        if(result.length === 1) {
          return true;
        } else {
          console.log("3. User does not exist in our database");
          return false;
        }
    });
}

// router.get('/user/new#_=_', function(req, res) {
//   res.redirect('/user/new');
// });

router.post('/', function(req, res) {
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
                item + " is required."
            );
        }
    }
  }

router.get('/login', function(req, res) {
  res.render('login');
});

router.get('/logout', function(req, res, next) {
  req.session = null;
  res.redirect('/index');
});

//TODO: compare with bcrypt here
router.post('/auth', function(req, res, next) {
  knex('users').select('username', 'password', 'id').where({
    username: req.body.username
  }).then(function(data) {
    // this if works
    console.log(data);
    if (data.length === 1) {
      bcrypt.compare(req.body.password, data[0].password, function(err, result) {
      if (result) {
          //TODO: change to render landing page with greeting + user's name (dynamically update in header partial)
          req.session = {};
          req.session.user_id = data[0].id;
          req.session.user_name = data[0].username;
          console.log(req.session);
          res.redirect('/index');
      } else {
          //TODO: output on same page with same message in error format
          res.send('Sorry, username and password don\'t match.');
      }
     });
    } //TODO: output on same page with same message in error format
    else {
      res.send('Sorry, username not found.');
    }
  }).catch(next);
});


module.exports = router;
