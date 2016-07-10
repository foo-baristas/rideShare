
exports.up = function(knex, Promise) {

  return knex.schema.createTable('users', function (table) {

    table.increments();
    table.string('alternate_id');
    table.string('username');
    table.string('password');
    table.string('phone_number');
    table.string('email');
    table.string('profile_picture');

    table.boolean('isAdmin');
  });
};

exports.down = function(knex, Promise) {

  return knex.schema.dropTableIfExists('users');
};
