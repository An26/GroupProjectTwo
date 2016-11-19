var models  = require('../models');
var express = require('express');
var router  = express.Router();
var fs = require('fs');
var pdf = require('pdfkit');
//need to require pdfkit, and global variables for resume defined here

router.get('/', function(req, res) {
    res.redirect('/login');
});

router.post('/signup', function(req,res) {
	//add user to database
	req.session.registerUsername = req.body.registrarUsername;
	req.session.registerPassword = req.body.registrarPassword;
	models.user.findOne({where:{email:req.session.registerUsername}})
	.then(function(existingUser){
		if(existingUser){
		//user partial to send error message:'user name already existed, please try another username.'
		} else {
			models.user.create({
				email:req.session.registerUsername,
				password:req.session.registerPassword
			})
		}
	})
	.then(function(newuser){
		res.redirect('/login');
	})
	
});

router.get('/signup', function(req,res) {
	res.render('register');
});

router.get('/login', function(req,res) {
	
	res.render('login');
});

router.post('/signin',function(req,res){
	//query the database and authenticate the user
	//if authenticated, redirect to user,
	//if not, display error message using partial and stay on login
	res.redirect('resume/user');
});

router.get('/resume/user', function(req, res) {
	//once the information is validated and next button is hit, render education
	res.render('index');

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
});

router.get('/resume/projects',function(req,res){
	res.render('projects');
});

router.post('/work', function(req,res) {
	//once the information is validated and next button is hit, render resume preview
	 req.session.projectName = req.body.projectName;
	 req.session.description = req.body.description;
	 req.session.url = req.body.projectUrl;
	 req.session.date = req.body.projectDate;
	//session variable username
	models.user.findOne({where:{email:req.session.registerUsername}})
	.then(function(currentUser){
		models.project.create({
				userId: currentUser.id,
				projectName: req.session.projectName,
				url:req.session.url,
				dates:req.session.date
		})
	})
	.then(function(project){
		res.redirect('/resume/work');
	})
});

router.get('/resume/work',function(req,res){
	res.render('workHistory');
})

 router.post('/buildResume', function(req,res) {
// once user hit download, run pdfkit with info above
	 req.session.companyNmae = req.body.companyName;
	 req.session.companyLocation = req.body.companyLocation;
	 req.session.title = req.body.title;
	 req.session.workYears = req.body.years;
	 req.session.responsibility = req.body.responsibility;
	 req.session.duties = req.body.duties;
	//session variable username
	models.user.findOne({where:{email:req.session.registerUsername}})
	.then(function(currentUser){
		models.work.create({
			userId:currentUser.id,
			companyName:req.session.companyName,
			location:req.session.companyLocation,
			title:req.session.title,
			years:req.session.workYears,
			responsibilities:req.session.responsibility,
			duties:req.session.duties
		})
	})
	.then(function(work){
		res.redirect('/buildResume');
	})
 });

 router.get('/buildResume',function(req,res){
	res.render('preview');
})
//generate pdf file using pdfkit



module.exports = router