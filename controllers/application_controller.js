var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.get('/', function(req, res) {
    res.redirect('login');
});

router.get('/login', function(req,res) {
	res.render('login');
});

router.get('/resume/user', function(req, res) {
	res.render('index');
})

router.get('/resume/education', function(req,res) {
	res.render('education');
});


router.get('/resume/projects', function(req,res) {
	res.render('projects');
});


router.get('/resume/work', function(req,res) {
	res.render('workHistory');
});

//can be used later...
// router.get('/buildResume', function(req,res) {
// 	res.render('buildResume');
// });



module.exports = router