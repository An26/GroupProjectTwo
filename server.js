var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var app = express();

app.use(express.static('./public'))

// controllers
var application_controller = require('./controllers/application_controller');

// body-parser
app.use(bodyParser.urlencoded({
	extended: false
}));

// method-override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

// handlebars
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
	defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');



//what are our routes?
// var routes = require('./controllers/cats_controller.js');
// app.use('/', routes);
app.use('/', application_controller);

// sequelize
var models = require('./models');
models.sequelize.sync().then(function (){

	var PORT = process.env.PORT || 3000;
	app.listen(PORT);

});
