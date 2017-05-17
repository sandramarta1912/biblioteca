//load enviroment variables
require('dotenv').config();
// grab our dependencies
const express 		 = require('express'),
	passport 		 = require('passport'),
	app 			 = express(),
	port 			 = process.env.PORT || 8080,
	expressLayouts   = require('express-ejs-layouts'),
	mongoose 		 = require('mongoose'),
	bodyParser       = require('body-parser'),
	session			 = require('express-session'),
	cookieParser	 = require('cookie-parser'),
	flash			 = require('connect-flash'),
	expressValidator = require('express-validator'),	
	localStrategy 	 = require('passport-local').Strategy
;

//set sessions and cookie parser
app.use(cookieParser());
app.use(session({
	secret:process.env.SECRET,
	cookie: { maxAge: 60000 },
	resave: false, //forces the session to be save back to the  back to the store
	saveUnitialized: false //don't save unmodified
}));
app.use(flash());

//passport
app.use(passport.initialize());
app.use(passport.session());

// Initialize Passport
var initPassport = require('./app/authentication/init');
initPassport(passport);

//tell express where to look for static assets
app.use(express.static(__dirname + '/public'));

//set ejs our templating engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(expressLayouts);

//connect to our database
mongoose.connect(process.env.DB_URI);

//use body parser to grab info from a form
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(expressValidator());

// set the routes
app.use(require('./app/routes'));

// start our server
app.listen(port, () => {
	console.log(`App listening on http://localhost:${port}`);
});
