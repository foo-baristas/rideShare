'use strict';

var express = require('express'),
    router = express.Router(),
    knex = require('../db/knex'),
    bcrypt = require('bcrypt');


// MIGHT NOT NEED THIS ROUTE IF MODAL ON LANDING PAGE IS SUCCESSFUL
router.get('/new', function(req, res) {
    res.render('newUser');
});


// router.get('/', function(req, res) {
//   knex('users').select().orderBy('id').then(function(data){
//     res.status(200).render('showUser', {users:data});
//    }).catch(function(err){
//     console.log(data[0]);
//     res.status(200).render('#######', data[0]);
//   }).catch(function(err){
//     console.error(err);
//     res.sendStatus(500);
//   });
// });

// FIX: DATABASE QUERY TO INCLUDE REVIEWER DETAILS

router.get('/:id', function(req, res) {
  knex.select('*').from('users').fullOuterJoin('reviews', 'users.id', 'reviews.reviewed_id').where('users.id', req.params.id).then(function(data){
    res.status(200).render('showUser', {user:data[0], canEditProfile: canEditProfile(data, req), creation_date: cleanDate(JSON.stringify(data[0].creation_date))});
  }).catch(function(err){
    console.error(err);
    res.sendStatus(500);
  });
});


function canEditProfile(data, req){
  if(data[0].username == req.session.user_name) {
    console.log('This user is authorized to edit this profile');
    return true;
  } else {
    return false;
  }
}

function cleanDate(date) {
    var dateClean = date.slice(1, 11);
    return dateClean;
}

// router.get('/:id/edit', function(req, res) {
//   knex('users').select().where({id: req.params.id}).then(function(data){
//     res.status(200).render('editUser', {user:data[0]});
//   }).catch(function(err){
//     console.error(err);
//     res.sendStatus(500);
//   });
// });
//

// router.post('/', function(req, res, next) {
//     //hash pw here before posting it
//     bcrypt.genSalt(Number(req.body.saltRounds), function(err, salt) {
//         bcrypt.hash(req.body.password, salt, function(err, hash) {
//             //insert here
//             knex('users').insert({
//                 username: req.body.username,
//                 password: hash
//             }).then(function(data) {
//                 res.redirect('/user');
//             }).catch(next);
//         });
//     });
// });

router.post('/', function(req, res) {
  console.log(req.body);
  var post = req.body

  bcrypt.genSalt(Number(post.saltRounds), function(err, salt) {
    bcrypt.hash(post.password, salt, function(err, hash) {
      knex('users').insert({
          username: post.username,
          password: hash,
          name_first: post.name_first,
          name_last: post.name_last,
          profile_pic_url: post.profile_pic_url,
          age: post.age,
          description: post.description,
          email: post.email,
          smoking: post.smoking,
          eating: post.eating,
          pets: post.pets,
          music: post.music,
          talking: post.talking,
          is_driver: post.is_driver,
          isFB_verified: post.isFB_verified
      }).then(function() {
          //TODO: change redirect later to: res.redirect('/trip/search');
          res.redirect('/index/auth');
      }).catch(function(next) {
          console.error(err);
          res.sendStatus(500);
      });
    });
  });
});

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
