var models  = require('../models');
var express = require('express');
var router  = express.Router();
var bcrypt = require('bcrypt-nodejs');
var handlebars = require('handlebars');


router.get('/signin', function(req, res) {

    if(req.query.e) {
        switch(req.query.e) {
            case '1':
                var e = 'Password or Username is invalid';
                break;  
        }
    }
    res.render('login', { e: e });
});


router.post('/signin', function(req, res) {

    models.user.findOne({
        where: { email: req.body.email }
    }).then(function(user) {
		if (user == null){
			res.redirect('/signin?e=1');
		}

        console.log('User found, checking password');

    // check password
    bcrypt.compare(req.body.password, user.password, function(err, result) {

        console.log('password complare is ' + result);

      if (result == true){
        req.session.loggedin = true;
		req.session.username = user.username;
        req.session.email = user.email;

        res.redirect('/');
      }
      // password is wrong
      else{
        res.redirect('/signin');
	}
    });
  });
});


router.get('/signout', function(req, res) {
    handlebars.unregisterHelper('signout');
    req.session.destroy(function(err) {
        res.redirect('/')
  });
});


router.get('/signup', function(req, res) {
    res.render('signUp');
});


router.post('/signup', function(req, res) {

    // check if user already has an account
    models.user.findAll({
        where: { email: req.body.email }
    }).then(function(users) {
        if(users.length > 0) {
            res.send('User already exists!');
        } else {
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(req.body.password, salt, null, function(err, hash) {
                    // save to database
                    models.user.create({
                        email: req.body.email,
                        password: hash
                    }).then( function() {
                        req.session.loggedin = true;
                        req.session.username = req.body.username;
                        req.session.email = req.body.email;
                        res.redirect('/');
                    });
                });
            });
        }
    });    
});


module.exports = router;

