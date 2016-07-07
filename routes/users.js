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
//     res.status(200).render('######', {users:data});
//    }).catch(function(err){
//     console.log(data[0]);
//     res.status(200).render('#######', data[0]);
//   }).catch(function(err){
//     console.error(err);
//     res.sendStatus(500);
//   });
// });

// FIX: DATABASE QUERY TO INCLUDE REVIEWER DETAILS
// FIX GETUSERINTO FUNCTION BELOW
router.get('/:id', function(req, res) {

  knex.select('*').from('users').where('users.id', req.params.id).then(function(data) {



    //console.log(data[0]);
    res.status(200).render('showUser', {
      user: data[0],
      canEditProfile: canEditProfile(data, req),
      reviews: showReviews(req)
      //creation_date: cleanDate(JSON.stringify(data[0].creation_date))
    });
  }).catch(function(err){
    console.error(err);
    res.sendStatus(500);
  });
});

function showReviews(req){
  knex.select('*').from('users').fullOuterJoin('reviews', 'users.id', 'reviews.reviewed_id').where('users.id', req.params.id).then(function(data){
    console.log('entered the showReviews function');
    console.log(data[0]);
    if(data[0].id) {
      return true;
    } else {
      return false;
    }
  });
}

// function getUserInfo(req){
//   knex.select('*').from('users').where('users.id', req.params.id).then(function(data) {
//     //console.log(data[0]);
//     return data[0];
//   });
// }

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

// THIS WORKS DON'T TOUCH IT!!!!! :)
router.get('/:id/edit', function(req, res) {
  knex('users').select().where({id: req.params.id}).then(function(data){
    res.status(200).render('editUser', {user:data[0]});
  }).catch(function(err){
    console.error(err);
    res.sendStatus(500);
  });
});

//POST NEW USER INFO WORKING
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
      }).returning('id')
        .then(function(id) {
          //TODO: change redirect later to: res.redirect('/trip/search');
          res.redirect('/user/' + id);

      }).catch(function(err) {
          console.error(err);
          res.sendStatus(500);
      });
    });
  });
});


//THIS WORKS DON'T TOUCH IT!!! :)
router.put('/:id', function(req, res) {
  var post = req.body;
  console.log(post);

    knex('users').update({
        name_first: post.name_first,
        name_last: post.name_last,
        profile_pic_url: post.profile_pic_url,
        age: post.age,
        description: post.description,
        email: post.email,
        username: post.username,
        password: post.password,
        smoking: post.smoking,
        eating: post.eating,
        pets: post.pets,
        music: post.music,
        talking: post.talking,
        is_driver: post.is_driver,
        isFB_verified: post.isFB_verified
    }).where('id', req.params.id).then(function() {
        res.redirect('/user/' + req.params.id);
    }).catch(function(err) {
        console.error(err);
        res.sendStatus(500);
    });
});

//DELETE USER WORKS
router.delete('/:id', function(req, res){
  knex('users').where('id', req.params.id).del().then(function(data){
    res.redirect('/index');
  }).catch(function(err){
    console.error(err);
    res.sendStatus(500);
  });
});

module.exports = router;
