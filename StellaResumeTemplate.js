var fs = require('fs');
var inquirer = require('inquirer');
var pdf = require('pdfkit');

inquirer.prompt([
  {
    name: 'name',
    message: 'Name'
  },
  {
    name: 'street',
    message: 'Street Address',
  },
  {
    name: 'rest',
    message: 'City, State and Zip Code',
  },
  {
    name: 'phone',
    message: 'Phone'
  },
  {
    name: 'email',
    message: 'Email'
  },
  {
    name: 'github',
    message: 'Github URL'
  },
  {
    name: 'summary',
    message: 'Summary'
  },
  {
    name: 'school',
    message: 'School Name'
  },
  {
    name: 'schoolLocation',
    message: 'School location(city, state)'
  },
  {
    name: 'major',
    message: 'Major'
  },
  {
    name: 'degree',
    message: 'Degree'
  },
  {
    name: 'gpa',
    message: 'GPA'
  },
  {
    name: 'honor',
    message: 'Honors'
  },
  {
    name: 'years',
    message: 'Years attended(MM/YY - MM/YY)'
  },
  {
    name: 'company',
    message: 'Company'
  },
  {
    name:'companyLocation',
    message:'Company location(city, state)'
  }
  {
    name: 'title',
    message: 'Title'
  },
  {
    name: 'workYears',
    message: 'Work years(MM/YY - MM/YY)'
  },
  {
    name: 'responsiblities',
    message: 'General Responsiblities'
  },
  {
    name: 'duties',
    message: 'Detailed Responsiblities'
  },
  {
    name: 'project',
    message: 'Project Name'
  },
  {
    name: 'description',
    message: 'Description'
  },
  {
    name: 'URL',
    message: 'Related URL'
  },
  {
    name: 'date',
    message: 'Date'
  },
  {
    name: 'skills',
    message: 'Skills'
  }
]).then(makeDoc);

function makeDoc(answer) {
  doc = new pdf;

  doc.pipe(fs.createWriteStream(process.argv[2]));

  doc.text(' ', {align: 'left'}).fontSize(25);
  doc.text(answer.name, {align: 'left'}).fontSize(12);
  doc.text(answer.rest, {align: 'right'}).fontSize(12);
  doc.text(answer.phone, {align: 'right'}).fontSize(12);
  doc.text(answer.email, {align: 'right'}).fontSize(12);
  doc.text(answer.github, {align: 'right'}).fontSize(12);
  doc.moveDown();

  doc.text(' ', {align: 'left'}).fontSize(13);
  doc.text('SUMMARY', {underline:true}).fontSize(12);
  doc.text(answer.summary).fontSize(12);
  doc.moveDown();

  doc.text(' ', {align: 'left'}).fontSize(13);
  doc.text('EDUCATION', {underline:true}).fontSize(12);
  doc.text(answer.school + ' (' + answer.years + ')'+' '+answer.schoolLocation).fontSize(12);
  doc.text(answer.degree + ' ' + answer.gpa).fontSize(12);
  doc.text(answer.major+' major').fontSize(12);
  doc.text('Honors: '+answer.honor).fontSize(12);
  doc.moveDown();

  doc.text(' ', {align: 'left'}).fontSize(13);
  doc.text('WORK EXPERIENCEC', {underline:true}).fontSize(12);
  doc.text(answer.company + ' ' + answer.workYears+' '+answer.companyLocation).fontSize(12);
  doc.text(answer.title).fontSize(12);
  doc.text(answer.responsiblities).fontSize(12);
  doc.text(answer.duties).fontSize(12);
  doc.moveDown();

  doc.text(' ', {align: 'left'}).fontSize(13);
  doc.text('PROJECTS', {underline:true}).fontSize(12);
  doc.text(answer.project+' ('+answer.date+') ').fontSize(12);
  doc.text(answer.description).fontSize(12);
  doc.text(answer.URL).fontSize(12);
  doc.moveDown();

  doc.text(' ', {align: 'left'}).fontSize(13);
  doc.text('SKILLS', {underline:true}).fontSize(12);
  doc.text(answer.skills).fontSize(12);
  doc.moveDown();

  doc.end();
}
