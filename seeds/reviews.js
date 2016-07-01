'use strict';

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('reviews').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('reviews').insert({reviewer_id: 2, reviewed_id: 1, rating: 5, comment: 'This driver is the best driver ever. Not only did she arrive punctually, but she also brought tons of cookies for the passengers to eat.', creation_date: Date.now() }),
        knex('reviews').insert({reviewer_id: 1, reviewed_id: 2, rating: 1, comment: 'This Billy character is so creepy. He said that I was sooooooo hot, and that he wanted to touch my hiney. Also something about a penguion. So creepy.', creation_date: Date.now() }),
      ]);
    });
};
