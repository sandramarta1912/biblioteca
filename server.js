//load enviroment variables
require('dotenv').config();
// grab our dependencies
const express 		 = require('express'),
	csrf			 = require('csurf'),
	passport 		 = require('passport'),
	app 			 = express(),
	port 			 = process.env.PORT || 8080,
	expressLayouts   = require('express-ejs-layouts'),
	mongoose 		 = require('mongoose'),
	bodyParser       = require('body-parser'),
	session			 = require('express-session'),
	cookieParser	 = require('cookie-parser'),
	flash			 = require('connect-flash'),
	expressValidator = require('express-validator')
;

//set sessions and cookie parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(csrf({ cookie: true }));

// error handler
app.use(function (err, req, res, next) {
	if (err.code !== 'EBADCSRFTOKEN') return next(err)

	// handle CSRF token errors here
	res.status(403);
	res.send('Invalid CSRF token.');
});

app.use(session({
	secret:process.env.SECRET,
	cookie: { maxAge: 60000 },
	resave: false, //forces the session to be save back to the  back to the store
	saveUnitialized: false //don't save unmodified
}));
app.use(flash());

// Custom flash middleware -- from Ethan Brown's book, 'Web Development with Node & Express'
// found at https://gist.github.com/brianmacarthur/a4e3e0093d368aa8e423
app.use(function(req, res, next){
	// if there's a flash message in the session request, make it available in the response, then delete it
	res.locals.sessionFlash = req.session.sessionFlash;
	delete req.session.sessionFlash;
	next();
});

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

app.use(expressValidator({
	customValidators: {
		lte: function(param, num) {
			return param <= num;
		},
		gte: function(param, num) {
			return param >= num;
		}
	}
}));

app.use(function (req, res, next) {
	res.locals.isAuthenticated = req.isAuthenticated();
	next();
});

// set the routes
app.use(require('./app/routes'));

// start our server
app.listen(port, () => {
	console.log(`App listening on http://localhost:${port}`);
});
