'use strict';

var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
// var bcrypt = require('bcrypt');

router.get('/', function(req, res) {
    res.render('index', {
        hasError: false,
        origin: '',
        destination: '',
        date: ''
    });
});

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
        // If there arent any validation errors, TODO:redirect to '/searchResults'
        //res.send('form sent correctly');
        res.redirect('/trip/search?origin=' + req.body.origin + '&destination=' + req.body.destination + '&date=' + req.body.date);
    } else {
        console.log(info);
        // If there are validation errors, re-render the signup page, injecting the users previous inputs.
        //TODO: set values on index.hbs when templating is figured out so users' input shows up when re-rendering
        //TODO: show error messages and render data from error obj on index.hbs
        res.render('index', info);
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
            info.error[item].push({
                message: item + " is required."
            });
        }
    }
}

router.get('/login', function(req, res) {
    res.render('login');
});

//TODO: seed new data with hashed pw to use compare with bcrypt here
router.post('/auth', function(req, res, next) {
    knex('users').select('username', 'password').where({
    username: req.body.username
    }).then(function(data) {
      // this if works
        if (data.length === 1) {
            if (req.body.password === data[0].password) {
                //TODO: change to render landing page with greeting + user's name (dynamically update in header partial)
                res.render('index');
            } else {
                //TODO: output on same page with same message in error format
                res.send('Sorry, username and password don\'t match.');
            }
        } //TODO: output on same page with same message in error format
            else {
            res.send('Sorry, username not found.');
        }
    }).catch(next);
});


module.exports = router;
