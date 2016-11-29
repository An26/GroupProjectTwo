var models  = require('../models');
var express = require('express');
var router  = express.Router();
var fs = require('fs');
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
		var info = req.session.email;
		console.log('THIS!', info);
		res.render('template', {loggedin: info});
	} else {
    	res.redirect('/signin?e=1');
	}
});

router.post('/user/:template',function(req,res){
	//get the template information
	template = req.params.template;
	console.log('using template '+template);
	res.redirect('/resume/user');
})


router.get('/resume/user', function(req, res) {
	//once the information is validated and next button is hit, render education
	res.render('user');
})

router.post('/education', function(req,res) {
	//once the information is validated and next button is hit, render projects
	//session variable username
	models.user.findOne({where:{email:userEmail}})
	.then(function(currentUser){
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
			honors:req.body.honors,
			userId:currentUser.id
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
	//once the information is validated and next button is hit, render resume previe
	//session variable username
	models.user.findOne({where:{email:userEmail}})
		.then(function(currentUser){
			models.project.create({
				projectName: req.body.projectName,
				url:req.body.projectUrl,
				dates:req.body.projectDate,
				description:req.body.projectDescription,
				userId:currentUser.id
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
	//session variable username
	models.user.findOne({where:{email:userEmail}})
	.then(function(currentUser){
		models.work.create({
			companyName:req.body.companyName,
			location:req.body.companyLocation,
			title:req.body.title,
			years:req.body.companyYears,
			responsibilities:req.body.responsibility,
			duties:req.body.duties,
			userId:currentUser.id
		})
	})
	.then(function(result){
		console.log(template);
		if(template === '1') {
			res.redirect('/preview/1');
		}
		if(template === '2') {
			res.redirect('/preview/2');
		}
		if(template === '3') {
			res.redirect('/preview/3');
		}
	})
 });

router.get('/preview/1',function(req,res){
	//jquery dynamically change the html
	var userID = 0;
	models.user.findOne({where:{email:userEmail}})
	.then(function(user){
	userData = user;
	userID = user.id;
	})
		.then(function(result){
		models.education.findAll({where:{userId:userID}})
		})
		.then(function(education){
			models.work.findAll({where:{userId:userID}})
			educationData = education;
			})
			.then(function(work){
				models.project.findAll({where:{userId:userID}})
				workData = work;
			})
				.then(function(project){
					projectData = project;
					var data = {user:userData,education:educationData,project:projectData,work:workData}
					res.render('resume1',data);
			})
	})

router.get('/preview/2',function(req,res){
	res.render(resume2);
});
 router.get('/preview/3',function(req,res){
 	//jquery dynamically change the html
	res.render(resume3);
});

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