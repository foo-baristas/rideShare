module.exports = {

  development: {
    client: 'postgresql',
    connection: 'postgres://localhost/ride-share',
    pool: {
      min: 1,
      max: 1
    }
  }
};
