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
router.get('/books/seed', booksController.seedBooks);
//show a single book

router.get('/books/:slug', booksController.showSingle);
//create books

//edit books
//delete books
