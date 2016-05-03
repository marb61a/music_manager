var express = require('express');
var router = express.Router();
var Firebase = require('firebase');
var fbRef = new Firebase('');
var multer = require('multer');
var upload = multer({dest:'./public/images/uploads'});

router.get('/', function(req, res, next) {
  	res.render('albums/index');
});

router.get('./add', function(req, res, next) {
    var genreRef = fbRef.child('genres');

	genreRef.once('value', function(snapshot){
		var data = [];
		snapshot.forEach(function(childSnapshot){
			var key = childSnapshot.key();
			var childData = childSnapshot.val();
			data.push({
				id: key,
				name: childData.name
			});
		});
		res.render('albums/add',{genres: data});
	});
});

module.exports = router;
