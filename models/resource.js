'use strict';

var Checkit = require('checkit');
var rules = new Checkit({
  name_first: {
    rule: 'required',
    message: 'You need a first name'}
  // },
  // name: [
  //   {
  //     rule: 'required',
  //     message: 'Name is required.'
  //   }, {
  //     rule: 'alpha',
  //     message: 'Name can only have alphabetical characters'
  //   }]
  // ], tags: {
  //    //you can also use a custom made function to create a rule instead of using a pre-defined one
  //    rule: function(value){
  //     var match = //some regexexpression
  //     if(!match) throw new Error('Must be a comma separated list of words.')
  //   }
  // }


});

var validate = function(data) {
  return rules.run(data);
}

module.exports = {
  validate: validate
}


//in routes:
// var Resource = require('../models/resource');
// router.post('/new', function(req, res, next) {
//   Resource.validate(req.body).then(function(values)[
//     knex('resources').insert({name:values.name})
//   ])
// })
