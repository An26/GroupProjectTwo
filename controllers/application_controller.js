var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.get('/', function(req, res) {

	if(req.session.loggedin) {
		res.render('template');
	} else {
    	res.redirect('/signin?e=1');
	}
});

router.post('/user/:template',function(req,res){
	//get the template information
	req.session.template = req.params.template;
	console.log('using template '+req.session.template);
	res.redirect('/resume/user');
})

router.get('/resume/user', function(req, res) {
	//once the information is validated and next button is hit, render education
	res.render('user');
})

router.post('/education', function(req,res) {
	//once the information is validated and next button is hit, render projects
	 req.session.name = req.body.fullName;
	 req.session.street = req.body.street;
	 req.session.rest = req.body.rest;
	 req.session.phoneNumber = req.body.phoneNumber;
	 req.session.githubUrl = req.body.githubUrl;
	 req.session.summary = req.body.summary;
	//session variable username
	models.user.findOne({where:{email:req.session.registerUsername}})
	.then(function(currentUser){
		currentUser.update({
				name:req.session.name,
				phone:req.session.phoneNumber,
				street:req.session.street,
				rest:req.session.rest,
				github:req.session.githubUrl,
				summary:req.session.summary
		})
	})
		res.redirect('/resume/education');
});

router.get('/resume/education',function(req,res){
	res.render('education');
})

router.post('/projects', function(req,res) {
	//once the information is validated and next button is hit, render work
	 req.session.schoolName = req.body.schoolName;
	 req.session.schoolLocation = req.body.schoolLocation;
	 req.session.major = req.body.major;
	 req.session.degree = req.body.degree;
	 req.session.schoolYears = req.body.years;
	 req.session.gpa = req.body.gpa;
	 req.session.honors = req.body.honors;
		//session variable username
	models.user.findOne({where:{email:req.session.registerUsername}})
	.then(function(currentUser){
		models.education.create({
			userId:currentUser.id,
			schoolName:req.session.schoolName,
			location:req.session.schoolLocation,
			major:req.session.major,
			degree:req.session.degree,
			years:req.session.schoolYears,
			gpa:req.session.gpa,
			honors:req.session.honors
		})
	})
	.then(function(education){
		res.redirect('/resume/projects');
	})
>>>>>>> Stashed changes
});

module.exports = router