var models  = require('../models');
var express = require('express');
var router  = express.Router();
//need to require pdfkit, and global variables for resume defined here

router.get('/', function(req, res) {
    res.redirect('login');
});

router.get('/register', function(req,res) {
	//add user to database
});

router.get('/login', function(req,res) {
	//query the database and authenticate the user
	//if authenticated, render index,
	//if not, display error message and stay on login
});

router.get('/resume/user', function(req, res) {
	//once the information is validated and next button is hit, render education

})

router.get('/resume/education', function(req,res) {
	//once the information is validated and next button is hit, render projects
});


router.get('/resume/projects', function(req,res) {
	//once the information is validated and next button is hit, render work
});


router.get('/resume/work', function(req,res) {
	//once the information is validated and next button is hit, render resume preview
});

//can be used later...
// router.get('/buildResume', function(req,res) {
// once user hit download, run pdfkit with info above
// });



module.exports = router