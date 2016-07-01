'use strict';

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('users').insert({name_first: 'Jane', name_last: 'Doe', profile_pic_url: 'http://placehold.it/350x350', age: 30, description: 'I am a web developer from Colorado and love to travel all over the United States in search of National Parks.', email: 'janedoe@gmail.com', username: 'janedoe', password: 'janedoe', preferences_id: 1, is_driver: true, isFB_verified: true}),
        knex('users').insert({name_first: 'Billy', name_last: 'Madison', profile_pic_url: 'http://placehold.it/350x350', age: 50, description: 'I graduated from kindergarten when I was, like, twenty, and now I just drive around the country with other people. I hope that you have room in your car for me.', email: 'billymadison@yahoo.com', username: 'billy', password: 'billy', preferences_id: 2, is_driver: false, isFB_verified: true}),
      ]);
    });
};
