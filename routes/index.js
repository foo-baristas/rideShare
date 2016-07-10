'use strict';

var express = require('express');
var app = express();
var router = express.Router();
var knex = require('../db/knex');
var bcrypt = require('bcrypt');



router.get('/', function(req, res) {

});

router.post('/auth', function(req, res, next) {

});

router.get('/login', function(req, res) {

});

router.get('/logout', function(req, res, next) {

  req.session = null;
  res.redirect('/');
});

module.exports = router;
