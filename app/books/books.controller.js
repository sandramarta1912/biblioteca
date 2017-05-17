const Book = require('../models/book');	
module.exports = {

	showBooks: showBooks,
	showSingle: showSingle,
	seedBooks: seedBooks,
	showCreate: showCreate,
	processCreate: processCreate,
	showEdit: showEdit,
	processEdit: processEdit,
	deleteBook: deleteBook

}

	/**
	* show all books
	*/
	function showBooks(req, res) {


		// get all books
		Book.find({}, (err, books) => {
			if (err) {
				res.status(404);
				res.send('Books not found!');
			}
		//return a view with data
		res.render('pages/books/books', { books: books });

		});

	
	}
	/**
	*show  a single book
	*/
	
	function showSingle(req,res) {
		//get a single book
		Book.findOne({ description:req.params.slug }, (err, book) => {

			if (err) {
				res.status(404);
				res.send('Book not found!');
			}

		res.render('pages/books/single', { 
			book: book,
			success: req.flash('success')
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
*Show the create form
*/
	function showCreate(req, res) {
		res.render('pages/books/create',{
			errors: req.flash('errors')
		});
	}

/**
*Process the creation form 
*/
	function processCreate(req, res) {
		//validate information
		req.checkBody('name', 'Name is require.').notEmpty();
		req.checkBody('author', 'Description is require.').notEmpty();
		
		// if there are errors, redirect  and save eroors to flash
		const errors = req.validationErrors();

		if (errors) {
			req.flash('errors', errors.map(err => err.msg));
			return res.redirect('/books/create');
		}

		//create new book
		const book = new Book({

			name: req.body.name,
			author: req.body.author
			
		});
		//save book
	book.save((err) =>{
		if(err)
			throw err;

		//set a successful flash message
		req.flash('success', 'Successfuly created book!');
		//redirect to the newly created book
		res.redirect(`/books/${book.description}`);

	});

	}

	/**
	* show the edit form
	*/
	function showEdit (req, res) {
		Book.findOne({description: req.params.slug },(err, book) => {
			res.render('pages/books/edit', {
				book: book,
				errors: req.flash('errors')
				
			});
		});
		

	}

	/**
	* process the edit form
	*/

	function processEdit (req, res) {
		req.checkBody('name', 'Name is require.').notEmpty();
		req.checkBody('author', 'Description is require.').notEmpty();
		
		
		// if there are errors, redirect  and save eroors to flash
		const errors = req.validationErrors();

		if (errors) {
			req.flash('errors', errors.map(err => err.msg));
			return res.redirect(`/books/${req.params.slug}/edit`);
		}
		// finding a current book
		Book.findOne({ description: req.params.slug }, (err, book) => {
		//updating that book
		book.name   = req.body.name;
		book.author = req.body.author;
		
		book.save((err) => {
			if(err)
				throw err;

		//succes flash message


		// redirect back to the books
			req.flash('success', 'Successfuly updated book!');
			res.redirect('/books');
		});	

		});
		
	}

	/**
	* delete a book
	*/
	function deleteBook(req, res) {
		Book.remove({ description: req.params.slug }, ( err ) => {
			//set flash data
			//redirect back to the book page
			req.flash('success', 'Book deleted!');
			res.redirect('/books');

		});
	}


	

	


	
