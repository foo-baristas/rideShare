
exports.up = function(knex, Promise) {

  return knex.schema.createTable('passengers', function(table) {

    table.increments();
    table.integer('trip_id');
    table.integer('user_id');
  });
};

exports.down = function(knex, Promise) {

  return knex.schema.dropTableIfExists('passengers');
};
