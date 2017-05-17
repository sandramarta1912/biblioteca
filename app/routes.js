//create a new express router
const express = require('express'),
	router = express.Router();
	mainController = require('./controllers/main.controller');
	booksController = require('./books/books.controller');
	searchController = require('./books/search.controller');
	readersController = require('./readers/readers.controller');
	userController = require('./controllers/user.controller');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}	
	
//export router
module.exports = router;

//main routes
router.get('/', mainController.showHome);

// Books
router.get('/books', 		 booksController.showBooks);
router.get('/search',		 searchController.searchBook);
router.get('/books/create',  booksController.showCreate);
router.post('/books/create', booksController.processCreate);

router.get('/books/:slug/edit', booksController.showEdit);
router.post('/books/:slug/', 	booksController.processEdit);

router.get('/books/:slug/delete', booksController.deleteBook);
router.get('/books/:slug', booksController.showSingle);

//router.get('/books/seed', 	 booksController.seedBooks);

// Readers
router.get('/readers',		 readersController.showReaders);
router.get('/readers/create',  readersController.showCreate);
router.post('/readers/create', readersController.processCreate);
router.get('/readers/:slug/delete', readersController.deleteReader);
router.get('/readers/:slug', readersController.showSingle);

// Users
router.get('/user/register', userController.showCreate);
router.post('/user/register', userController.processCreate);                           
router.get('/user/login', userController.showLogin);
router.post('/user/login', userController.processLogin);
