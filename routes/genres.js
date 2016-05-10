var express = require('express');
var router = express.Router();
var Firebase = require('firebase');
var fbRef = new Firebase('https://musicmanager.firebaseio.com/');

router.get('*', function(req, res, next) {
	// Check Authentication
	if(fbRef.getAuth() == null){
	  	res.redirect('/users/login');
	}
	next();
});

router.get('/', function(req, res, next) {
    var genreRef = fbRef.child('genres');
    
    genreRef.once('value', function(snapshot){
        var genres = [];
        snapshot.forEach(function(childSnapshot){
            var key = childSnapshot.key();
			var childData = childSnapshot.val();
			genres.push({
				id: key,
				name: childData.name
			});
        });
        
        res.render('genres/index',
        {
            genres: genres
        });
    });
});

router.get('/add', function(req, res, next) {
  	res.render('genres/add');
});

router.post('/add', function(req, res, naxt){
    var genre = {
        name : req.body.name
    };
    var genreRef = fbRef.child('genres');
  	genreRef.push().set(genre);

  	req.flash('success_msg', 'Genre Saved');
  	res.redirect('/genres');
});

router.get('/edit/:id', function(req, res, next) {
    var id = req.params.id;
    var genreRef = new Firebase('https://musicmanager.firebaseio.com/genres/' + id);
    genreRef.once('value', function(snapshot){
        var genre = snapshot.val();
        res.render('genres/edit', {genre: genre, id: id});
    });
});

router.post('/edit/:id', function(req, res, naxt) {
    var id = req.params.id;
    var name = req.body.name;
    var genreRef = new Firebase('https://musicmanager.firebaseio.com/genres' + id);
    
    genreRef.update({
        name : name
    });
    
    res.redirect('/genres');
});

router.delete('/delete/:id', function(req, res, next){
    var id = req.params.id;
    var genreRef = new Firebase('https://musicmanager.firebaseio.com/genres/' + id);
    genreRef.remove();
    
	req.flash('success_msg','Genre Deleted');
	res.send(200);
});

module.exports = router;
