//create a new express router
const express = require('express'),
	router = express.Router();
	mainController = require('./controllers/main.controller');
	booksController = require('./controllers/books.controller');
	searchController = require('./controllers/search.controller');
	readersController = require('./controllers/readers.controller');
	userController = require('./controllers/user.controller')
;

const passport = require('passport');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
};
	
//export router
module.exports = router;

//main routes
router.get('/', mainController.showHome);

// Books
router.get('/books', 		 booksController.showBooks);
router.get('/search',		 searchController.searchBook);
router.get('/books/create', isAuthenticated, booksController.showCreate);
router.post('/books/create', isAuthenticated, booksController.processCreate);
router.get('/books/:slug/edit', isAuthenticated, booksController.showEdit);
router.post('/books/:slug', isAuthenticated, booksController.processEdit);
router.get('/books/:slug/delete',  isAuthenticated, booksController.deleteBook);
router.get('/books/:slug', booksController.showSingle);
//router.get('/books/seed', 	 booksController.seedBooks);

// Readers
router.get('/readers',		 readersController.showReaders);
router.get('/readers/create', isAuthenticated, readersController.showCreate);
router.post('/readers/create', isAuthenticated, readersController.processCreate);
router.get('/readers/:slug/delete', isAuthenticated, readersController.deleteReader);
router.get('/readers/:slug', readersController.showSingle);

// Users
router.get('/user/register', userController.showCreate);
router.post('/user/register', passport.authenticate('local-signup', {
	successRedirect : '/', // redirect to the secure profile section
	failureRedirect : '/user/register', // redirect back to the signup page if there is an error
	failureFlash : true // allow flash messages
}));

router.get('/user/login', userController.showLogin);
router.post('/user/login',
	passport.authenticate(
		'local-login',
		{
			successRedirect: '/',
			failureRedirect: '/user/login',
			failureFlash: true
		}
	)
);

router.get('/user/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

router.get('/user/forgot-password', userController.forgotPasswordShow);
router.post('/user/forgot-password', userController.forgotPasswordProcess);

router.get('/user/reset-password', userController.resetPasswordShow);
router.post('/user/reset-password', userController.resetPasswordProcess);
