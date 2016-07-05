module.exports = {

  development: {
    client: 'postgresql',
    connection: 'postgres://localhost/ride_share',
    pool: {
      min: 1,
      max: 1
    }
  },

  test: {
    client: 'postgres',
    connection: 'postgres://postgres@localhost/ride_share',
    pool: {
      min: 1,
      max: 1
    }
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};
