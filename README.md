# rideShare

rideShare



# comments


Things to watch out for and improve
- models of user and rides would make for cleaner code
- migration should not be used for sample data eg. 20160701143037_trips.js
sample data should deployed as a knex seed.
- commented out code should be cleaned up by the time it gets to the master branch
- why does the showRide.hbs file have the <html> and <head> tags? all other views are just the <body> tags
- handlebar helpers should be in a different file
- creating a ride does not fail nicely, I get a 500 error.
accessing a non existent trip eg(http://gschool-rideshare.herokuapp.com/trip/100) times out
- accessing a non existent user does not fail nicely, I get a 500 error.
- no validation on adding review rating
- reviews are not showing up per user
- check if a picture exists before using it, otherwise get a placeholder
- route file search.js should be named trip.js
- edit user profile input fields are not aligned
