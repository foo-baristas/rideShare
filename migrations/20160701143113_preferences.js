'use strict';

exports.up = function(knex, Promise) {

  return knex.schema.createTable('preferences', function(table) {

    table.increments();
    table.boolean('isSmoking');
    table.boolean('isPets');
    table.boolean('isTalking');
    table.boolean('isMusic');
    table.boolean('isFood');
    table.string('luggage_size');
    table.integer('luggage_num');
  }).then(function(data) {

    return Promise.all([
      knex('preferences').insert({

        isSmoking: false,
        isPets: false,
        isTalking: false,
        isMusic: true,
        isFood: true,
        luggage_size: 'None',
        luggage_num: 0
      }),
      knex('preferences').insert({

        isSmoking: true,
        isPets: false,
        isTalking: false,
        isMusic: true,
        isFood: false,
        luggage_size: 'Small',
        luggage_num: 2
      }),
    ]);
  });
};

exports.down = function(knex, Promise) {

  return knex.schema.dropTable('preferences');
};
