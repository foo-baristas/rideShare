'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('fbIDs', function (table) {
    table.increments();
    table.integer('fb_id').notNullable();
    table.integer('user_id').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('fbIDs');
};
