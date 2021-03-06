'use strict';

var express = require('express'),
router = express.Router(),
knex = require('../db/knex'),
bcrypt = require('bcrypt');

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
var nameArray = [];
router.get('/new', function(req, res, next) {
  res.render('newUser');
});

router.get('/:id', function(req, res) {
  knex.select('*').from('users').where('users.id', req.params.id).then(function(data) {
    //console.log(data[0]);
    res.status(200).render('showUser', {
      user: data[0],
      canEditProfile: canEditProfile(data, req),
      //creation_date: cleanDate(JSON.stringify(data[0].creation_date))
    });
  }).catch(function(err){
    console.error(err);
    res.sendStatus(500);
  });
});

function canEditProfile(data, req){
  if(data[0].username === req.session.user_name) { //CHANGED == to ===
    console.log('This user is authorized to edit this profile');
    return true;
  } else {
    return false;
  }
}

router.get('/:id/reviews', function(req, res) {

  knex.select('*').from('users').fullOuterJoin('reviews', 'users.id', 'reviews.reviewed_id').where('users.id', req.params.id).then(function(data) {
    console.log(data);
    res.status(200).render('usersReviews', {
      review: data
      //creation_date: cleanDate(JSON.stringify(data[0].creation_date))
    });
  }).catch(function(err){
    console.error(err);
    res.sendStatus(500);
  });
});

router.get('/:id/new-review', function(req, res) {
  res.render('newReview', {user: req.params.id});
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

//TODO: delete this passwordCheck function or refactor following route into it
// function passwordCheck(data, req){
//   var check;
//   if (req.body.password !== req.body.password_confirm) {
//     console.log('passwords match');
//     check = false;
//   } else {
//     console.log('passwords do not match')
//     check = true;
//   }
// }

//POST NEW USER INFO WORKING
router.post('/', function(req, res) {
  console.log(req.body);
  var post = req.body;
  //if is_driver exists in the database (if it's truthy, set it equal to true, if not, then false)
  var is_driver = ((post.is_driver) ? true : false);

  var user = {
    username: post.username,
    password: '',
    password_confirm: '',
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
    is_driver: is_driver,
    isFB_verified: false
  };

  if (req.body.password !== req.body.password_confirm) {
     console.log('passwords don\'t match');
     user.password_error = true;
     res.render('newUser', {user : user});
  } else {
     console.log('passwords don\'t match');
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
          is_driver: is_driver,
          isFB_verified: false
      }).returning('id')
        .then(function(id) {
          //req.session = {};
          req.session.user_id = id[0];
          req.session.user_name = post.username;
          console.log(req.session);
          res.redirect('/user/' + id);
      }).catch(function(err) {
          console.error(err);
          res.sendStatus(500);
      });
    });
  });
 }
});

//POST NEW FACEBOOK USER INFO
router.post('/fb', function(req, res) {
  console.log(req.body);
  var post = req.body;
  post.name_first = nameArray[0][0];
  post.name_last = nameArray[0][1];
  //if is_driver exists in the database (if it's truthy, set it equal to true, if not, then false)
  var is_driver = ((post.is_driver) ? true : false);

  var user = {
    username: post.username,
    password: '',
    password_confirm: '',
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
    is_driver: is_driver,
    isFB_verified: true
  };

  if (req.body.password !== req.body.password_confirm) { //change
     console.log('passwords don\'t match');
     user.password_error = true;
     res.render('newFBUser', {user : user});
  } else {
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
          is_driver: is_driver,
          isFB_verified: true
      })
      .returning('id')
      .then(function(id){
        console.log(id);
        knex('fbIDs').insert({
          fb_id: (String(req.session.passport.user.id)).slice(12),
          user_id: id[0]
        }).returning('user_id')
      .then(function(id) {
          req.session = {};
          req.session.user_id = id[0];
          req.session.user_name = post.username;
          console.log(req.session);
          res.redirect('/user/' + id);
      }).catch(function(err) {
          console.error(err);
          res.sendStatus(500);
      });
    });
  });
});
}
});

//THIS WORKS DON'T TOUCH IT!!! :)
router.put('/:id', function(req, res) {
  var post = req.body;
  var is_driver = ((post.is_driver) ? true : false);
  console.log(post);
    knex('users').where('id', req.params.id).update({
        username: post.username,
        //password: hash,
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
        is_driver: is_driver,
        isFB_verified: post.isFB_verified
      }).returning('id')
      .then(function(id) {
        res.redirect('/user/' + id);
      }).catch(function(err) {
        console.error(err);
        res.sendStatus(500);
      });
    });
//   });
// });

//DUPLICATE FROM EARLIER VERSION OF ABOVE ROUTE
//THIS WORKS DON'T TOUCH IT!!! :)
// router.put('/:id', function(req, res) {
//   var post = req.body;
//   console.log(post);
//
//   knex('users').update({
//     name_first: post.name_first,
//     name_last: post.name_last,
//     profile_pic_url: post.profile_pic_url,
//     age: post.age,
//     description: post.description,
//     email: post.email,
//     username: post.username,
//     password: post.password,
//     smoking: post.smoking,
//     eating: post.eating,
//     pets: post.pets,
//     music: post.music,
//     talking: post.talking,
//     is_driver: post.is_driver,
//     isFB_verified: post.isFB_verified
//   }).where('id', req.params.id).then(function() {
//     res.redirect('/user/' + req.params.id);
//   }).catch(function(err) {
//     console.error(err);
//     res.sendStatus(500);
//   });
// });

router.post('/:id/new-review', function(req, res) {
  console.log(req.session.user_id);
  var post = req.body;
  knex('reviews').insert({
    reviewer_id: req.session.user_id,
    reviewed_id: req.params.id,
    rating: post.rating,
    comment: post.comment,
    creation_date: new Date()
  }).then(function() {
    res.redirect('/user/' + req.params.id);
  }).catch(function(err) {
    console.error(err);
    res.sendStatus(500);
  });
});

//DELETE USER WORKS
router.delete('/:id', function(req, res){
  knex('users').where('id', req.params.id).del().then(function(data){
    req.session = null;
    res.redirect('/');
  }).catch(function(err){
    console.error(err);
    res.sendStatus(500);
  });
});

module.exports = router;
