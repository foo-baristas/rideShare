// Update with your config settings.
'use strict';

module.exports = {

  development: {
    client: 'postgresql',
    connection: 'postgres://localhost/ride-share',
    pool: {
      min: 2,
      max: 10
    }
  }

//   production: {
//     client: 'postgresql',
//     connection: {
//       database: 'my_db',
//       user:     'username',
//       password: 'password'
//     },
//     pool: {
//       min: 2,
//       max: 10
//     },
//     migrations: {
//       tableName: 'knex_migrations'
//     }
//   }
// 
};
