// load enviroment variables
require('dotenv').config();

// grab our dependencies
const express 		 = require('express'),
	csrf			 = require('csurf'),
	passport 		 = require('passport'),
	app 			 = express(),
	port 			 =  8080,
/*	expressLayouts   = require('express-ejs-layouts'),*/
	mongoose 		 = require('mongoose'),
	bodyParser       = require('body-parser'),
	session			 = require('express-session'),
	cookieParser	 = require('cookie-parser'),
	flash			 = require('connect-flash'),
	expressValidator = require('express-validator'),
	MongoClient 	 = require('mongodb').MongoClient,
	pug 			 = require('pug'),
	path = require('path');

// set sessions and cookie parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(csrf({ cookie: true }));

// error handler
app.use(function (err, req, res, next) {
	if (err.code !== 'EBADCSRFTOKEN') {return next(err)}

	// handle CSRF token errors here
	res.status(403);
	res.render('pages/error/403');
});

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




// route for facebook authentication and login
// different scopes while logging in
app.get('/login/facebook',
	passport.authenticate('facebook', { scope : 'email' }
	));

// handle the callback after facebook has authenticated the user
app.get('/login/facebook/callback',
	passport.authenticate('facebook', {
		successRedirect : '/body.pug',
		failureRedirect : '/'
	})
);

// Initialize Passport
var initPassport = require('./app/authentication/init');
initPassport(passport);

//tell express where to look for static assets
app.use(express.static(__dirname + '/public'));

//set ejs our templating engine
/*app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(expressLayouts);*/

// set pug our templating engine

app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "pug");


//connect to our database
mongoose.connect(process.env.MONGODB_URI);


//use body.pug parser to grab info from a form
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


app.use(function (req, res, next) {
	if (undefined != req.user && req.user.local.roles.includes('admin')) {
		res.locals.isAdmin = true;
	} else {
		res.locals.isAdmin = false;
	}
	next();
});


// set the routes
app.use(require('./app/routes'));

app.use(function(req, res, next) {
	res.status(400);
	res.render('pages/error/404');
});




// start our server
app.listen( port, () => {
	console.log(`App listening on http://localhost:${port}`);

});
