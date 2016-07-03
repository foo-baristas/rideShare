'use strict';

var express = require('express'),
    router = express.Router(),
    knex = require('../db/knex');



// MIGHT NOT NEED THIS ROUTE IF MODAL ON LANDING PAGE IS SUCCESSFUL
router.get('/new', function(req, res) {
  res.render('newUser');
});

router.get('/', function(req, res) {
  knex('users').select().orderBy('id').then(function(data){
    res.status(200).render('showUser', {users:data});
   }).catch(function(err){
    console.log(data[0]);
    res.status(200).render('showUser', data[0]);
  }).catch(function(err){
    console.error(err);
    res.sendStatus(500);
  });
});


// FIX: DATABASE QUERY TO INCLUDE REVIEWER DETAILS

router.get('/:id', function(req, res) {
  knex.select('*').from('users').fullOuterJoin('reviews', 'users.id', 'reviews.reviewed_id').where('users.id', req.params.id).then(function(data){
    console.log(data);
    res.status(200).render('showUser', {user:data[0]});
  }).catch(function(err){
    console.error(err);
    res.sendStatus(500);
  });
});


//
//
// router.get('/:id/edit', function(req, res) {
//   knex('users').select().where({id: req.params.id}).then(function(data){
//     res.status(200).render('editUser', {user:data[0]});
//   }).catch(function(err){
//     console.error(err);
//     res.sendStatus(500);
//   });
// });
//
// // IS FOLLOWING ROUTE CORRECT?
// router.post('/', function(req, res) {
//
//   //  CONTINUE TO FILL IN INSERT OBJECT
//
//   knex('users').insert({name_first: req.body.user.name_first, name_last: req.body.user.name_last, profile_pic_url: req.body.user.profile_pic_url, age: req.body.user.age, description: req.body.user.description, email: req.body.user.email, username: req.body.user.username, password: req.body.user.password, preferences_id: req.body.user.preferences_id, is_driver: req.body.user.is_driver, isFB_verified: req.body.user.isFB_verified}).then(function(data){
//     res.redirect('/user/' + req.params.id);
//   }).catch(function(err){
//     console.error(err);
//     res.sendStatus(500);
//   });
// });
//
// router.put('/:id', function(req, res) {
//
//   // COPY INSERT OBJECT FROM ABOVE HERE
//
//   knex('users').update({name_first: req.body.user.name_first, name_last: req.body.user.name_last, profile_pic_url: req.body.user.profile_pic_url, age: req.body.user.age, description: req.body.user.description, email: req.body.user.email, username: req.body.user.username, password: req.body.user.password, preferences_id: req.body.user.preferences_id, is_driver: req.body.user.is_driver, isFB_verified: req.body.user.isFB_verified}).where({id: req.params.id}).then(function(data){
//     res.redirect('/user/' + req.params.id);
//   }).catch(function(err){
//     console.error(err);
//     res.sendStatus(500);
//   });
// });
//
// router.delete('/:id', function(req, res){
//   knex('users').delete().where({id: req.params.id}).then(function(data){
//     res.redirect('/');
//   }).catch(function(err){
//     console.error(err);
//     res.sendStatus(500);
//   });
// });

module.exports = router;
