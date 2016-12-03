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
		userEmail = req.session.email;
		res.render('template');
	} else {
    	res.redirect('/signin');
	}
});

router.post('/user/:template',function(req,res){
	//get the template information
	template = req.params.template;
	console.log('using template '+template);
	res.redirect('/resume/user');
})

router.get('/resume/user', function(req, res) {
	console.log("querying name: " + req.query.email)
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
			schoolName:req.body.schoolName1,
			location:req.body.schoolLocation1,
			major:req.body.major1,
			degree:req.body.degree1,
			years:req.body.years1,
			GPA:req.body.gpa1,
			honors:req.body.honors1,
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
				projectName: req.body.projectName1,
				url:req.body.projectUrl1,
				dates:req.body.projectDate1,
				description:req.body.projectDescription1,
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
			companyName:req.body.companyName1,
			location:req.body.companyLocation1,
			title:req.body.title1,
			years:req.body.companyYears1,
			responsibilities:req.body.responsibility1,
			duties:req.body.duties1,
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
	models.user.findOne({where:{email:userEmail}})
	.then(function(user){
	userData = user;
	models.education.findAll({where:{userId:user.id}})
	.then(function(education){
		educationData = education;
		models.work.findAll({where:{userId:user.id}})
		.then(function(work){
			workData = work;
			models.project.findAll({where:{userId:user.id}})
			.then(function(project){
				projectData = project;
			}).then(function(result){
				var data = {
					user:userData.get({plain: true}),
					education:educationData,
					project:projectData,
					work:workData
				}
				console.log(data.user);
				res.render('resume1', {
					layout: 'resume1',
					data: data
				});
			})
		})
	})
})
	

});

router.get('/preview/2',function(req,res){
	models.user.findOne({where:{email:userEmail}})
	.then(function(user){
	userData = user;
	models.education.findAll({where:{userId:user.id}})
	.then(function(education){
		educationData = education;
		models.work.findAll({where:{userId:user.id}})
		.then(function(work){
			workData = work;
			models.project.findAll({where:{userId:user.id}})
			.then(function(project){
				projectData = project;
			}).then(function(result){
				var data = {
					user:userData.get({plain: true}),
					education:educationData,
					project:projectData,
					work:workData
				}
				console.log(data.user);
				res.render('resume2', {
					layout: 'resume2',
					data: data
				});
			})
		})
	})
})
});

 router.get('/preview/3',function(req,res){
	models.user.findOne({where:{email:userEmail}})
	.then(function(user){
	userData = user;
	models.education.findAll({where:{userId:user.id}})
	.then(function(education){
		educationData = education;
		models.work.findAll({where:{userId:user.id}})
		.then(function(work){
			workData = work;
			models.project.findAll({where:{userId:user.id}})
			.then(function(project){
				projectData = project;
			}).then(function(result){
				var data = {
					user:userData.get({plain: true}),
					education:educationData,
					project:projectData,
					work:workData
				}
				console.log(data.user);
				res.render('resume3', {
					layout: 'resume3',
					data: data
				});
			})
		})
	})
})
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

router.post('/another/education', function(req,res) {
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

});

router.post('/another/project', function(req,res) {
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

});

router.post('/another/work', function(req,res) {
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
});
module.exports = router;