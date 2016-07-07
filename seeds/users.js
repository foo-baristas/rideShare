exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries

        knex('users').insert({name_first: 'Pam', name_last: 'Foster', profile_pic_url: 'http://placehold.it/350x350', age: 30, description: 'I am a web developer from Colorado and love to travel all over the United States in search of National Parks.', email: 'janedoe@gmail.com', username: 'janedoe', password: 'janedoe', smoking: null, eating: 'eating', pets: null, music: 'music', talking: null, is_driver: true, isFB_verified: true}),

        knex('users').insert({name_first: 'Billy', name_last: 'Madison', profile_pic_url: 'http://placehold.it/350x350', age: 50, description: 'I graduated from kindergarten when I was, like, twenty, and now I just drive around the country with other people. I hope that you have room in your car for me.', email: 'billymadison@yahoo.com', username: 'billy', password: 'billy', smoking: null, eating: 'eating', pets: null, music: 'music', talking: null, is_driver: false, isFB_verified: true}),
        
        knex('users').insert({name_first: 'Jennie', name_last: 'Zinko', profile_pic_url: 'http://placehold.it/350x350', age: 32, description: 'I love riding horses and I want to take a roadtrip', email: 'jzinko@yahoo.com', username: 'jennie', password: 'jennie', smoking: null, eating: 'eating', pets: null, music: 'music', talking: null, is_driver: false, isFB_verified: true}),

      ]);
    });
};
