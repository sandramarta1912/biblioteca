const Book = require('../models/book');	
module.exports = {

	showBooks: showBooks,
	showSingle: showSingle,
	seedBooks: seedBooks,
	showCreate: showCreate,
	processCreate: processCreate

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
		res.render('pages/books', { books: books });

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

		res.render('pages/single', { 
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

		res.render('pages/create')
	}

/**
*Process the creation form 
*/
	function processCreate(req, res) {
		//validate information
		

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

	


	
