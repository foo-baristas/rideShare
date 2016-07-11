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
app.engine('.hbs', handlebars({
  defaultLayout: 'single',
  extname: '.hbs',
  helpers: {

  }
}));

app.set('view engine', '.hbs');
app.use(express.static(path.join(__dirname, '/public/')));

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
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
  next();
});


app.use('/index', index);
app.use('/user', user);
app.use('/trip', search);

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
  console.log('Listening on port ' + port);
});

module.exports = app;
