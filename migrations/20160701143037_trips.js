'use strict';

exports.up = function(knex, Promise) {

  return knex.schema.createTable('trips', function(table) {

    table.increments();
    table.string('start_location');
    table.string('end_location');
    table.string('details');
    table.integer('num_seats');
    table.integer('trip_cost');
    table.integer('preferences_id');
    table.integer('user_id');
    table.string('car_description');
    table.string('car_img_url');
    table.dateTime('date_of');
  }).then(function(data) {

    return Promise.all([
      knex('trips').insert({

        start_location: 'Denver',
        end_location: 'Fort Collins',
        details: 'I\'m driving down to the Ogden for the Blue October concert.',
        num_seats: 2,
        trip_cost: 15,
        preferences_id: 1,
        user_id: 1,
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
        preferences_id: 1,
        user_id: 1,
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
