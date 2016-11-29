var models  = require('../models');
var express = require('express');
var router  = express.Router();
var fs = require('fs');
var exphbs = require('express-handlebars');
var pdf = require('html-pdf');
var handlebars = require('handlebars');
var fs = require('fs');
var userEmail = '';


router.get('/', function(req, res) {

	if(req.session.loggedin) {
		res.render('template');
		userEmail = req.session.email;
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
	models.user.findOne({where:{email:userEmail}})
	.then(function(currentUser){
		currentUser.update({
				name:req.body.fullName,
				phone:req.body.phoneNumber,
				street:req.body.street,
				rest:req.body.rest,
				github:req.body.gitHubUrl,
				summary:req.body.summary
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
	models.user.findOne({where:{email:userEmail}})
	.then(function(currentUser){
		models.education.create({
			schoolName:req.body.schoolName,
			location:req.body.schoolLocation,
			major:req.body.major,
			degree:req.body.degree,
			years:req.body.years,
			GPA:req.body.gpa,
			honors:req.body.honors
		})
		.then(function(education){
			currentUser.setEducation(education);
		})
	})
	.then(function(result){
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
	models.user.findOne({where:{email:userEmail}})
		.then(function(currentUser){
			models.project.create({
				projectName: req.body.projectName,
				url:req.body.projectUrl,
				dates:req.body.projectDate,
				description:req.body.projectDescription
			})
			.then(function(project){
				currentUser.setProject(project);
			})
		})
		.then(function(result){
			res.redirect('/resume/work');
		})
});

router.get('/resume/work',function(req,res){
	res.render('workHistory');
})

 router.post('/preview', function(req,res) {
// once user hit download, run pdfkit with info above
	 req.session.companyName = req.body.companyName;
	 req.session.companyLocation = req.body.companyLocation;
	 req.session.title = req.body.title;
	 req.session.workYears = req.body.companyYears;
	 req.session.responsibility = req.body.responsibility;
	 req.session.duties = req.body.duties;
	//session variable username
	models.user.findOne({where:{email:userEmail}})
	.then(function(currentUser){
		models.work.create({
			companyName:req.body.companyName,
			location:req.body.companyLocation,
			title:req.body.title,
			years:req.body.companyYears,
			responsibilities:req.body.responsibility,
			duties:req.body.duties
		})
		.then(function(work){
			currentUser.setWork(work);
		})
	})
	.then(function(result){
		if(req.session.template === 1) {
			res.redirect('/preview/1');
		}
		if(req.session.template === 2) {
			res.redirect('/preview/2');
		}
		if(req.session.template === 3) {
			res.redirect('/preview/3');
		}
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


module.exports = router;