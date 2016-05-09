var express = require('express');
var router = express.Router();
var Firebase = require('firebase');
var fbRef = new Firebase('https://musicmanager.firebaseio.com/');

router.get('/register', function(req, res, next) {
  	res.render('users/register');
});

router.get('/login', function(req, res, next) {
  	res.render('users/login');
});

router.post('/register', function(req, res, next){
    var first_name = req.body.first_name;
	var last_name = req.body.last_name;
	var email = req.body.email;
	var password = req.body.password;
	var password2 = req.body.password2;
	var location = req.body.location;
	var fav_artists = req.body.fav_artists;
	var fav_genres = req.body.fav_genres;
	
	// Check the validation
	req.checkBody('first_name', 'First Name is Required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    var errors = req.validation.errors;
    
	if(errors){
	    res.render('users/register', {
	        errors: errors
	    });    
	} else {
	    fbRef.createUser({
	        email: email,
			password: password
	    }, function(error, userData){
	        if(error){
				console.log("Error creating user: ", error);
			} else {
				console.log("Successfully created user with uid:",userData.uid);
				var user = {
					uid: userData.uid,
					email: email,
					first_name: first_name,
					last_name: last_name,
					location: location,
					fav_genres: fav_genres,
					fav_artists: fav_artists
				};
				var userRef = fbRef.child('users');
				userRef.push().set(user);

				req.flash('success_msg', 'You are now registered and can login');
				res.redirect('/users/login');
			}
	    });
	}
	
});

module.exports = router;
