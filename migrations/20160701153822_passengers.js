'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('passengers', function (table) {
    table.increments();
    table.integer('trip_id').notNullable();
    table.integer('user_id').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('passengers');
};
