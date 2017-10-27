//create a new express router
const express = require('express'),
	router = express.Router();
	mainController = require('./controllers/main.controller');
	booksController = require('./books/books.controller');
	searchController = require('./books/search.controller');
	readersController = require('./readers/readers.controller');
	userController = require('./users/user.controller');
	contactController = require('./contact/contact.controller');
	adminController= require('./admin/admin.controller');
	preacherController = require('./preacher/preacher.controller');
	sermonController =	require('./preacher/sermon.controller');



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


var isAuthenticatedOr403 = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}

	res.status(403);
	res.render('pages/error/403');
};

var isAdminOr403 = function(req, res, next) {
	if (req.user.local.roles.includes('admin')) {
		return next();
	}

	res.status(403);
	res.render('pages/error/403');
};

//export router
module.exports = router;

//main routes
router.get('/', mainController.showHome);

//admin routes
router.get('/admin',[isAuthenticatedOr403, isAdminOr403], adminController.admin);
router.get('/admin/sermons', adminController.showSermons);
router.get('/admin/preachers', adminController.showPreacher);
router.get('/admin/preacher/create', adminController.showCreate);
router.post('/admin/preacher/create',  adminController.processCreate);

// Books
router.get('/books', 		 booksController.showBooks);
router.get('/search',		 searchController.searchBook);
router.get('/books/:slug', booksController.showSingle);
router.get('/books/create', booksController.showCreate);
router.post('/books/create',  booksController.processCreate);
router.get('/books/:slug/edit', [isAuthenticatedOr403, isAdminOr403], booksController.showEdit);
router.post('/books/:slug', isAuthenticated, booksController.processEdit);
router.get('/books/:slug/delete',  [isAuthenticatedOr403, isAdminOr403], booksController.deleteBook);
router.get('/books/:slug', booksController.showSingle);

//router.get('/books/seed', 	 booksController.seedBooks);

// Readers
router.get('/readers', [isAuthenticatedOr403, isAdminOr403], readersController.showReaders);
router.get('/readers/create', [isAuthenticatedOr403, isAdminOr403], readersController.showCreate);
router.post('/readers/create', [isAuthenticatedOr403, isAdminOr403], readersController.processCreate);
router.get('/readers/:slug/edit', [isAuthenticatedOr403, isAdminOr403], readersController.showEdit);
router.post('/readers/:slug', [isAuthenticatedOr403, isAdminOr403], readersController.processEdit);
router.get('/readers/:slug/delete', [isAuthenticatedOr403, isAdminOr403], readersController.deleteReader);
router.get('/readers/:slug', readersController.showSingle);

// preachers
router.get('/preachers', preacherController.showPreacher);

//sermons
router.get('/sermons', sermonController.showSermons);
// router.get('/sermon/create', sermonController.showCreate);
// router.post('/sermon/create',  sermonController.processCreate);
// Users
// router.get('/admin',[isAuthenticatedOr403, isAdminOr403], adminController.admin);
// router.get('/admin/readers', [isAuthenticatedOr403, isAdminOr403], adminController.showReaders);
// router.get('/admin/books', [isAuthenticatedOr403, isAdminOr403], adminController.showBooks);
// router.get('/admin/create/book', [isAuthenticatedOr403, isAdminOr403], adminController.showCreateBook);
// router.post('/admin/create/book', [isAuthenticatedOr403, isAdminOr403], adminController.processCreateBook);
// router.get('/admin/create/reader', [isAuthenticatedOr403, isAdminOr403], adminController.showCreateReader);
// router.post('/admin/create/reader', [isAuthenticatedOr403, isAdminOr403], adminController.processCreateReader);
// router.get('/admin/:slug/edit', [isAuthenticatedOr403, isAdminOr403], adminController.showEdit);
// router.post('/admin/:slug', [isAuthenticatedOr403, isAdminOr403], adminController.processEdit);


router.get('/user/register', userController.showCreate);
router.post('/user/register', passport.authenticate('local-signup', {
	successRedirect : '/', // redirect to the secure profile section
	failureRedirect : '/user/register', // redirect back to the signup page if there is an error
	failureFlash : true // allow flash messages
}));

router.get('/user/login', userController.showLogin);

router.post(
	'/user/login',
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


router.get('/program.pug', mainController.showProgram);
router.get('/contact', contactController.showContact);
router.post('/contact', contactController.processContact);

router.get('/user/forgot-password', userController.forgotPasswordShow);
router.post('/user/forgot-password', userController.forgotPasswordProcess);

router.get('/user/reset-password', userController.resetPasswordShow);
router.post('/user/reset-password', userController.resetPasswordProcess);

//router.post('/user/login', userController.processLogin);
router.get('/change', userController.change);





