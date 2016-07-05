module.exports = {

  development: {
    client: 'postgresql',
    connection: 'postgres://localhost/ride_share',
    pool: {
      min: 1,
      max: 1
    }
  }
};
