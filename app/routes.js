//create a new express router
const express = require('express'),
	router = express.Router();
	mainController = require('./controllers/main.controller');
	booksController = require('./controllers/books.controller');
	readersController = require('./controllers/readers.controller');
//export router
module.exports = router;

//define routes

//main routes
router.get('/', mainController.showHome);
//book routes
router.get('/books', 		 booksController.showBooks);
//reader routes
router.get('/readers',		 readersController.showReaders);
//seed books
router.get('/books/seed', 	 booksController.seedBooks);






//create books

router.get('/books/create',  booksController.showCreate);
router.post('/books/create', booksController.processCreate);

//create reader
router.get('/readers/creat',  readersController.showCreate);
router.post('/readers/creat', readersController.processCreate);


//edit books

router.get('/books/:slug/edit', booksController.showEdit);
router.post('/books/:slug', 	booksController.processEdit);

//delete books
router.get('/books/:slug/delete', booksController.deleteBook);

//delete reader
router.get('/readers/:slug/delete', readersController.deleteReader);


//show a single book
router.get('/books/:slug', booksController.showSingle);
router.get('/readers/:slug', readersController.showSingle);






