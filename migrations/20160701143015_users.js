'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function (table) {
    table.increments();
    table.string('name_first').notNullable();
    table.string('name_last').notNullable();
    table.string('profile_pic_url');
    table.integer('age').notNullable();
    table.text('description').notNullable();
    table.string('email').notNullable();
    table.string('username').notNullable();
    table.string('password').notNullable();
    table.integer('preferences_id').notNullable();
    table.boolean('is_driver');
    table.boolean('isFB_verified').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
