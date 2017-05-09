//create a new express router
const express = require('express'),
	router = express.Router();
	mainController = require('./controllers/main.controller');
	booksController = require('./controllers/books.controller');
//export router
module.exports = router;

//define routes

//main routes
router.get('/', mainController.showHome);
//event routes
router.get('/books', 		 booksController.showBooks);
//seed books
router.get('/books/seed', 	 booksController.seedBooks);


//create books

router.get('/books/create',  booksController.showCreate);
router.post('/books/create', booksController.processCreate);

//edit books

router.get('/books/:slug/edit', booksController.showEdit);
router.post('/books/:slug', 	booksController.processEdit);

//delete books
router.get('/books/:slug/delete', booksController.deleteBook);


//show a single book
router.get('/books/:slug', booksController.showSingle);
