
exports.up = function(knex, Promise) {

  return knex.schema.createTable('reviews', function(table) {

    table.increments();
    table.integer('trip_id');
    table.integer('reviewer_id');
    table.integer('rating');
    table.text('description');
  });
};

exports.down = function(knex, Promise) {

};
