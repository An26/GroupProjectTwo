var models  = require('../models');
var express = require('express');
var router  = express.Router();
var fs = require('fs');
var pdf = require('pdfkit');
//need to require pdfkit, and global variables for resume defined here

router.get('/', function(req, res) {
    res.redirect('/login');
});

router.get('/register', function(req,res) {
	//add user to database
	req.session.registerUsername = req.body.registrarUsername;
	req.sessopm.registerPassword = req.body.registerPassword;
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
	res.redirect('/login');
	
});

router.get('/login', function(req,res) {
	//query the database and authenticate the user
	//if authenticated, redirect to user,
	//if not, display error message using partial and stay on login
	res.redirect('resume/user')
});

router.get('/resume/user', function(req, res) {
	//once the information is validated and next button is hit, render education
	res.render('user');

})

router.get('/resume/education', function(req,res) {
	//once the information is validated and next button is hit, render projects
	var req.session.name = req.body.fullName;
	var req.session.street = req.body.street;
	var req.session.rest = req.body.rest;
	var req.session.phoneNumber = req.body.phoneNumber;
	var req.session.githubUrl = req.body.githubUrl;
	var req.session.summary = req.body.summary;
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
	.then(function(updatedUser){
		res.render('education');
	})
});


router.get('/resume/projects', function(req,res) {
	//once the information is validated and next button is hit, render work
	var req.session.schoolName = req.body.schoolName;
	var req.session.schoolLocation = req.body.schoolLocation;
	var req.session.major = req.body.major;
	var req.session.degree = req.body.degree;
	var req.session.schoolYears = req.body.years;
	var req.session.gpa = req.body.gpa;
	var req.session.honors = req.body.honors;
		//session variable username
	models.user.findOne({where:{email:registerUsername}})
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
		res.render('projects');
	})
});


router.get('/resume/work', function(req,res) {
	//once the information is validated and next button is hit, render resume preview
	var req.session.projectName = req.body.projectName;
	var req.session.description = req.body.description;
	var req.session.url = req.body.projectUrl;
	var req.session.date = req.body.projectDate;
	//session variable username
	models.user.findOne({where:{email:registerUsername}})
	.then(function(currentUser){
		models.project.create({
				userId: currentUser.id,
				projectName: req.session.projectName,
				url:req.session.url,
				dates:req.session.date
		})
	})
	.then(function(project){
		res.render('workHostiry');
	})
});


 router.get('/buildResume', function(req,res) {
// once user hit download, run pdfkit with info above
	var req.session.companyNmae = req.body.companyName;
	var req.session.companyLocation = req.body.companyLocation;
	var req.session.title = req.body.title;
	var req.session.workYears = req.body.years;
	var req.session.responsibility = req.body.responsibility;
	var req.session.duties = req.body.duties;
	//session variable username
	models.user.findOne({where:{email:registerUsername}})
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
		res.render('preview');
	})
 });
//generate pdf file using pdfkit



module.exports = router