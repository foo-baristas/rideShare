'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('reviews', function (table) {
    table.increments();
    table.integer('reviewer_id').notNullable();
    table.integer('reviewed_id').notNullable();
    table.integer('rating').notNullable();
    table.text('comment').notNullable();
    table.timestamp('creation_date').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('reviews');
};
