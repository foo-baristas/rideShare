'use strict';

exports.up = function(knex, Promise) {
  return knex('trips').del()
    .then(function () {
      return Promise.all([
        knex('trips').insert({

          start_location: 'Denver',
          end_location: 'Fort Collins',
          details: 'I\'m driving down to the Ogden for the Blue October concert.',
          num_seats: 2,
          trip_cost: 15,
          user_id: 7,
          preferences_id: 1,
          car_description: '2000 Honda Civic',
          car_img_url: 'http://placekitten.com/200/300',
          date_of: new Date()
        }),
        knex('trips').insert({

          start_location: 'Fort Collins',
          end_location: 'Denver',
          details: 'I\'m driving back up after dropping after a friend in Denver. Keep me company?',
          num_seats: 1,
          trip_cost: 10,
          user_id: 9,
          preferences_id: 2,
          car_description: '2000 Toyota Corolla',
          car_img_url: 'http://placekitten.com/200/300',
          date_of: new Date()
        })
      ]);
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('trips');
};
