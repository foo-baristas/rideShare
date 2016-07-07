'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function (table) {
    table.increments();
    table.string('name_first');
    table.string('name_last');
    table.string('profile_pic_url');
    table.integer('age');
    table.text('description');
    table.string('email');
    table.string('username');
    table.string('password');

    table.text('smoking');
    table.text('eating');
    table.text('pets');
    table.text('music');
    table.text('talking');

    table.boolean('is_driver');
    table.boolean('isFB_verified');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
