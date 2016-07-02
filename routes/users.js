'use strict';

var express = require('express'),
    router = express.Router(),
    knex = require('../db/knex');


router.get('/', function(req, res) {
  knex('users').select().orderBy('id').then(function(data){
    res.status(200).render('showUser', {users:data});
  }).catch(function(err){
    console.error(err);
    res.sendStatus(500);
  });
});

// MIGHT NOT NEED THIS ROUTE IF MODAL ON LANDING PAGE IS SUCCESSFUL
// router.get('/new', function(req, res) {
//   res.render('users/new');
// });

router.get('/:id', function(req, res) {
  knex('users').select().where({id: req.params.id}).then(function(data){
    res.status(200).render('showUser', {user:data[0]});
  }).catch(function(err){
    console.error(err);
    res.sendStatus(500);
  });
});


router.get('/:id/edit', function(req, res) {
  knex('users').select().where({id: req.params.id}).then(function(data){
    res.status(200).render('editUser', {user:data[0]});
  }).catch(function(err){
    console.error(err);
    res.sendStatus(500);
  });
});

// IS FOLLOWING ROUTE CORRECT?
router.post('/', function(req, res) {

  //  CONTINUE TO FILL IN INSERT OBJECT

  knex('users').insert({name_first: req.body.user.name, }).then(function(data){
    res.redirect('/user/' + req.params.id);
  }).catch(function(err){
    console.error(err);
    res.sendStatus(500);
  });
});

router.put('/:id', function(req, res) {

  // COPY INSERT OBJECT FROM ABOVE HERE

  knex('users').update({name_first: req.body.user.name}).where({id: req.params.id}).then(function(data){
    res.redirect('/user/' + req.params.id);
  }).catch(function(err){
    console.error(err);
    res.sendStatus(500);
  });
});

router.delete('/:id', function(req, res){
  knex('users').delete().where({id: req.params.id}).then(function(data){
    res.redirect('/');
  }).catch(function(err){
    console.error(err);
    res.sendStatus(500);
  });
});

module.exports = router;
