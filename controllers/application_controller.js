var models  = require('../models');
var express = require('express');
var router  = express.Router();
//need to require pdfkit, and global variables for resume defined here

router.get('/', function(req, res) {
    res.redirect('/login');
});

router.get('/register', function(req,res) {
	//add user to database
	var registerUsername = req.body.registrarUsername;
	var registerPassword = req.body.registerPassword;
	models.user.findOne({where:{email:registerUsername}})
	.then(function(existingUser){
		if(existingUser){
		//user partial to send error message:'user name already existed, please try another username.'
		} else {
			models.user.create({
				email:registerUsername,
				password:registerPassword
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
	var name = req.body.fullName;
	var street = req.body.street;
	var rest = req.body.rest;
	var phoneNumber = req.body.phoneNumber;
	var githubUrl = req.body.githubUrl;
	var summary = req.body.summary;
	//session variable username
	models.user.findOne({where:{email:registerUsername}})
	.then(function(currentUser){
		currentUser.update({
				name:name,
				phone:phoneNumber,
				street:street,
				rest:rest,
				github:githubUrl,
				summary:summary
		})
	})
	.then(function(updatedUser){
		res.render('education');
	})
});


router.get('/resume/projects', function(req,res) {
	//once the information is validated and next button is hit, render work
	var schoolName = req.body.schoolName;
	var location = req.body.schoolLocation;
	var major = req.body.major;
	var degree = req.body.degree;
	var years = req.body.years;
	var gpa = req.body.gpa;
	var honors = req.body.honors;
		//session variable username
	models.user.findOne({where:{email:registerUsername}})
	.then(function(currentUser){
		models.education.create({
			userId:currentUser.id,
			schoolName:schoolName,
			location:location,
			major:major,
			degree:degree,
			years:years,
			gpa:gpa,
			honors:honors
		})
	})
	.then(function(education){
		res.render('projects');
	})
});


router.get('/resume/work', function(req,res) {
	//once the information is validated and next button is hit, render resume preview
	var projectName = req.body.projectName;
	var description = req.body.description;
	var url = req.body.projectUrl;
	var date = req.body.projectDate;
	//session variable username
	models.user.findOne({where:{email:registerUsername}})
	.then(function(currentUser){
		models.project.create({
				userId: currentUser.id,
				projectName: projectName,
				url:url,
				dates:date
		})
	})
	.then(function(project){
		res.render('workHostiry');
	})
});


 router.get('/buildResume', function(req,res) {
// once user hit download, run pdfkit with info above
	var companyNmae = req.body.companyName;
	var location = req.body.companyLocation;
	var title = req.body.title;
	var years = req.body.years;
	var responsibility = req.body.responsibility;
	var duties = req.body.duties;
	//session variable username
	models.user.findOne({where:{email:registerUsername}})
	.then(function(currentUser){
		models.work.create({
			userId:currentUser.id,
			companyName:companyName,
			location:location,
			title:title,
			years:years,
			responsibilities:responsibility,
			duties:duties
		})
	})
	.then(function(work){
		res.render('preview');
	})
 });



module.exports = router