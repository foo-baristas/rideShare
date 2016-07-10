'use strict';

var express = require('express'),
router = express.Router(),
knex = require('../db/knex'),
bcrypt = require('bcrypt');

router.get('/new', function(req, res, next) {

});

router.get('/:id', function(req, res) {

});

router.get('/:id/reviews', function(req, res) {

});

router.get('/:id/new-review', function(req, res) {

});

router.get('/:id/edit', function(req, res) {

});

router.post('/', function(req, res) {

});

router.put('/:id', function(req, res) {

});

router.post('/:id/new-review', function(req, res) {

});

router.delete('/:id', function(req, res){

});

module.exports = router;
