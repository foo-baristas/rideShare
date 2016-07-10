
exports.up = function(knex, Promise) {

  return knex.schema.createTable('trips', function (table) {

    table.increments();
    table.string('origin');
    table.string('destination');
    table.string('zip_code');
    table.string('date');
    table.sting('time');
    table.string('description');
    table.string('car_make');
    table.string('car_model');
    table.integer('preferences_id');
    table.integer('driver_id');
  });
};

exports.down = function(knex, Promise) {

};
