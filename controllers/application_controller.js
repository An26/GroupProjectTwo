var models  = require('../models');
var express = require('express');
var router  = express.Router();
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var pdf = require('pdfkit');
var exphbs = require('express-handlebars');
var pdf = require('html-pdf');
var handlebars = require('handlebars');
var fs = require('fs');

var userEmail = '';
var template = '';
var userData = {};
var educationData = {};
var workData = {};
var projectData = {};


router.get('/', function(req, res) {

	if(req.session.loggedin) {

		userEmail = req.session.email;
		if(userEmail === undefined) {
			userEmail = signupEmail;
		}
		console.log(userEmail);

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
		console.log(currentUser);
		currentUser.update({
				name:req.body.fullName,
				phone:req.body.phoneNumber,
				street:req.body.street,
				rest:req.body.rest,
				github:req.body.gitHubUrl,
				summary:req.body.summary,
				skills:req.body.skills
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
		console.log(currentUser);
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

 router.post('/preview', function(req,res) {
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
		res.redirect('/preview');
	})
 });


 router.get('/preview/:id',function(req,res){

	var template = 'resume' + req.params.id;

	res.render(template);
})


router.get('/preview/:id/download', function(req, res) {
	
	var template = 'views/resume' + req.params.id + '.handlebars';

	fs.readFile(template, 'utf8', function (err, data) {
    	if(err) throw err;
    	var html = '<html><body>' + data + '</body></html>';

    	var testdata = { foo: 'bar', };
    	var template = handlebars.compile(html);

    	var finalhtml = template(testdata);

		console.log(finalhtml);

		var filename = 'myresume.pdf';

		res.setHeader('Content-disposition', 'attachment; filename=' + filename);
		res.setHeader('Content-type', 'application/pdf');
		pdf.create(finalhtml).toStream(function(err, stream){
			stream.pipe(res);
		});
	});
})


module.exports = router