'use strict';

require('dotenv').load();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var handlebars = require('express-handlebars');
var knex = require('./db/knex');
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;

/* Require Routes */
var user = require('./routes/users');
var index = require('./routes/index');
var search = require('./routes/search');


var app = express();

// view handlebars setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', handlebars({defaultLayout: 'single', extname: '.hbs'}));
app.set('view engine', '.hbs');
app.use(express.static(path.join(__dirname, '/public/')));


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(methodOverride('_method'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//make the session cookie
app.use(cookieSession({
  name: 'session',
  keys: [process.env.KEY]
}));


app.use(function(req, res, next) {

  res.locals.session = req.session;
  console.log(res.locals.session);
  next();
});


app.use('/index', index);
app.use('/user', user);
app.use('/trip', search);


// app.use(cookieParser());

// START FACEBOOK LOGIN

passport.use(new Strategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/login/facebook/return'
  },
  function(accessToken, refreshToken, profile, cb) {
    // In this example, the user's Facebook profile is supplied as the user
    // record.  In a production-quality application, the Facebook profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    return cb(null, profile);
  }));

  // Configure Passport authenticated session persistence.
  //
  // In order to restore authentication state across HTTP requests, Passport needs
  // to serialize users into and deserialize users out of the session.  In a
  // production-quality application, this would typically be as simple as
  // supplying the user ID when serializing, and querying the user record by ID
  // from the database when deserializing.  However, due to the fact that this
  // example does not have a database, the complete Facebook profile is serialized
  // and deserialized.
  passport.serializeUser(function(user, cb) {
    cb(null, user);
  });

  passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
  });

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

app.get('/login/facebook',
  passport.authenticate('facebook'));



/// WORKING HERE ////
app.get('/login/facebook/return',
    passport.authenticate('facebook', { successRedirect: '/user/new', failureRedirect: '/login' }));



// function getRedirectURL(name){
//   console.log(name);
//   console.log('entered redirect function');
//   exists(name).then(function(result) {
//     console.log('entered promise function');
//     if(result.length === 1) {
//       return '/index';
//     } else {
//       return '/user/new';
//     }
//   });
// }
//
// function exists(name) {
//   var nameArray = name.split(' ');
//   return knex.select('*').from('users').where({name_first: nameArray[0], name_last: nameArray[1]});
// }



/// WORKING HERE END////







  // END FACEBOOK LOGIN

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on port " + port);
});

module.exports = app;
