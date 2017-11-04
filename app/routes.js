//create a new express router
const express = require('express'),
	router = express.Router(),
	mainController = require('./controllers/main.controller'),
	booksController = require('./books/books.controller'),
	searchController = require('./books/search.controller'),
	readersController = require('./readers/readers.controller'),
	userController = require('./users/user.controller'),
	contactController = require('./contact/contact.controller'),
	adminController= require('./admin/admin.controller'),
	preacherController = require('./preacher/preacher.controller'),
	sermonController =	require('./preacher/sermon.controller');

const passport = require('passport');

var User = require('./models/user');
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
router.get('/admin/sermons',[isAuthenticatedOr403, isAdminOr403], adminController.showSermons);
router.get('/admin/preachers',[isAuthenticatedOr403, isAdminOr403], adminController.showPreachers);
router.get('/admin/preacher/create',[isAuthenticatedOr403, isAdminOr403], adminController.showCreatePreacher);
router.post('/admin/preacher/create',[isAuthenticatedOr403, isAdminOr403],  adminController.processCreatePreacher);
router.get('/admin/sermon/create',[isAuthenticatedOr403, isAdminOr403], adminController.showCreateSermon);
router.post('/admin/sermon/create',[isAuthenticatedOr403, isAdminOr403],  adminController.processCreateSermon);
router.get('/admin/preacher/:slug/edit',[isAuthenticatedOr403, isAdminOr403], adminController.showEditPreacher);
router.post('/admin/preacher/:slug',[isAuthenticatedOr403, isAdminOr403], adminController.processEditPreacher);
router.get('/admin/preacher/:slug/delete',[isAuthenticatedOr403, isAdminOr403], adminController.deletePreacher);

// Books
router.get('/books', [isAuthenticatedOr403, isAdminOr403],		 booksController.showBooks);
router.get('/search',[isAuthenticatedOr403, isAdminOr403],		 searchController.searchBook);
router.get('/books/:slug', [isAuthenticatedOr403, isAdminOr403],booksController.showSingle);
router.get('/books/create',[isAuthenticatedOr403, isAdminOr403], booksController.showCreate);
router.post('/books/create',[isAuthenticatedOr403, isAdminOr403],  booksController.processCreate);
router.get('/books/:slug/edit', [isAuthenticatedOr403, isAdminOr403], booksController.showEdit);
router.post('/books/:slug', [isAuthenticatedOr403, isAdminOr403], booksController.processEdit);
router.get('/books/:slug/delete',  [isAuthenticatedOr403, isAdminOr403], booksController.deleteBook);
router.get('/books/:slug',[isAuthenticatedOr403, isAdminOr403], booksController.showSingle);

// Readers
router.get('/readers', [isAuthenticatedOr403, isAdminOr403], readersController.showReaders);
router.get('/readers/create', [isAuthenticatedOr403, isAdminOr403], readersController.showCreate);
router.post('/readers/create', [isAuthenticatedOr403, isAdminOr403], readersController.processCreate);
router.get('/readers/:slug/edit', [isAuthenticatedOr403, isAdminOr403], readersController.showEdit);
router.post('/readers/:slug', [isAuthenticatedOr403, isAdminOr403], readersController.processEdit);
router.get('/readers/:slug/delete', [isAuthenticatedOr403, isAdminOr403], readersController.deleteReader);
router.get('/readers/:slug',[isAuthenticatedOr403, isAdminOr403], readersController.showSingle);

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
router.post(
	'/user/register',
	function(req, res) {
		req.checkBody('firstName', 'FirstName is require.').notEmpty();
		req.checkBody('lastName', 'LastName is require.').notEmpty();
		req.checkBody('email', 'Email is required.').notEmpty();
		req.checkBody('email', 'Email is not valid.').isEmail();
		req.checkBody('password', 'Password is required.').notEmpty();
		req.checkBody('password2', ' Password confirmation is not the same.').equals(req.body.password);

		// if there are errors, redirect  and save eroors to flash
		const errors = req.validationErrors();

		if (errors) {
			// if there is no user with that email
			// create the user
			var newUser = new User();

			// set the user's local credentials
			newUser.local.email = req.body.email;
			newUser.local.firstName = req.body.firstName;
			newUser.local.lastName = req.body.lastName;

			res.render('pages/users/register',{
				errors: errors,
				user: newUser,
				csrfToken: req.csrfToken()
			});
			return
		}

		passport.authenticate('local-signup', {
			successRedirect : '/', // redirect to the secure profile section
			failureRedirect : '/user/register', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		})
});

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

router.get('/change', userController.change);





