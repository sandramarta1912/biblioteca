const Book = require('../models/book'),
	url = require('url');
var Pagination = require('../utils/Pagination');

module.exports = {
	showBooks:      showBooks,
	showSingle:     showSingle,
	seedBooks:      seedBooks,
	showCreate:     showCreate,
	processCreate:  processCreate,
	showEdit:       showEdit,
	processEdit:    processEdit,
	deleteBook:     deleteBook
};

/**
* show all books
*/
	function showBooks(req, res) {
		let itemsPerPage = 10;
		let currentPage = req.query.page != undefined ? req.query.page : 1;
		let offset = itemsPerPage * (currentPage - 1);

		// get all books
		Book.paginate({}, { offset: offset, limit: itemsPerPage }, function(err, result) {
			if (err) {
				res.status(404);
				return res.send('Oops... Something is awfully wrong!');
			}

			let pagination = new Pagination(req.url, result.total, itemsPerPage);

			// get all books
			Book.find({}, (err, books) => {
				if (err) {
					res.status(404);
					res.send('Books not found!');
				}
				//return a view with data
				//res.render('pages/books/books', {books: books});


				// return a view with data
				res.render('pages/books/books', {
					books: result.docs,
					pagination: pagination.paginate(),
					success: req.flash('success'),
					csrfToken: req.csrfToken()
				});

			});
		});
	}

/**
* show  a single book
*/

function showSingle(req,res) {
	

	Book.findOne({ description:req.params.slug }, (err, book) => {

		if (err) {
			res.status(404);
			res.send('Reader not found!');
		}
		res.render('pages/books/single', {
			book: book,
			success: req.flash('success'),
			csrfToken: req.csrfToken()
		});
	});



}
/**
* Seed the database
*/
function seedBooks(req, res) {
	//create some books
	const books = [
		{name: 'Fugi baiete, fugi!', author: 'Nicky Cruz' },
		{name: 'Cel mai bine pastrat secret al iadului', author:'Ray Comfort' },
		{name: 'Nobletea Suferintei', author:'Sabina W' },
		{name: 'Cautarile Contrabandistului', author:'James H' }
	];


	// use the Book model to insert/save
	Book.remove({}, () => {
		for(book of books) {
			var newBook = new Book(book);
			newBook.save();
		}
	});

	// seeded!
	res.send('Database seeded!');
}

/**
* Show the create form
*/

function showCreate(req, res) {
		res.render('pages/books/create',{
			errors: req.flash('errors'),
			csrfToken: req.csrfToken()
		});
	}


/**
* Process the creation form
*/
function processCreate(req, res) {
	//validate information
	req.checkBody('name', `Name is required.`).notEmpty();
	req.checkBody('author', `Description is required.`).notEmpty();
	req.checkBody('about', 'About is required.').notEmpty();

	// if there are errors, redirect  and save errors to flash
	const errors = req.validationErrors();

	if (errors) {
		req.flash('errors', errors.map(err => err.msg));
		return res.redirect('/books/create');
	}

	//create new book
	const book = new Book({
		name: req.body.name,
		author: req.body.author,
		about : req.body.about
	});

	//save book
	book.save((err) =>{
		if(err) {
			throw err;
		}
		//set a successful flash message
		req.flash('success', 'Successfuly created book!');
		//redirect to the newly created book
		res.redirect(`/books`);
	});


	}

/**
			 * Show the edit form
			 */
function showEdit(req, res) {
	Book.findOne({description: req.params.slug}, (err, book) => {
		if (err) {
			res.status(404);
			return res.send('Oops... That book does not exist!');
		}
		res.render('pages/books/edit', {
			book: book,
			errors: req.flash('errors'),
			csrfToken: req.csrfToken()
		});
	});
}

/**
 * process the edit form
 */

function processEdit(req, res) {
	req.checkBody('name', `Name is required.`).notEmpty();
	req.checkBody('author', `Description is required.`).notEmpty();
	req.checkBody('about', 'About is required.').notEmpty();

	// if there are errors, redirect  and save errors to flash
	const errors = req.validationErrors();

	if (errors) {
		req.flash('errors', errors.map(err => err.msg));
		return res.redirect(`/books/${req.params.slug}/edit`);
	}
	// finding a current book
	Book.findOne({description: req.params.slug}, (err, book) => {
		// updating that book
		book.name = req.body.name;
		book.author = req.body.author;
		book.about = req.body.about;

		book.save((err) => {
			if (err) {
				req.flash('error', 'The book could not be updated!');
				return res.redirect(`/books/${req.params.slug}/edit`);
			}

			// redirect back to the books
			req.flash('success', 'Successfully updated book!');
			res.redirect('/admin/books');
		});

	});
}


/**
 * Deletes a book
 */
function deleteBook(req, res) {
	Book.remove({description: req.params.slug}, (err) => {
		if (err) {
			//redirect back to the book page
			req.flash('error', 'The book could not be deleted!');
			return res.redirect('/books');
		}
		//redirect back to the book page
		req.flash('success', 'Book deleted!');
		res.redirect('/admin/books');
	});
}

