var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');

var app = express();

app.use(express.static(process.cwd() + './public'));

// controllers
var application_controller = require('./controllers/application_controller');
var auth_controller = require('./controllers/auth_controller.js')

//allow sessions
app.use(session({ secret: 'app', cookie: { maxAge: 60000 }}));
// app.use(cookieParser())

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
app.use('/', auth_controller)

// sequelize
var models = require('./models');
models.sequelize.sync().then(function (){

	var PORT = process.env.PORT || 3000;
	console.log('Listening on port ' + PORT);
	app.listen(PORT);

});
