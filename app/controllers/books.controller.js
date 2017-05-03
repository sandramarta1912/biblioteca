const Book = require('../models/book');	
module.exports = {

	showBooks: showBooks,
	showSingle: showSingle,
	seedBooks: seedBooks
	

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

		Book.findOne({'description':req.params.description}, (err, book) => {
			if (err) {
				res.status(404);
				res.send('Book not found!');
			}

		res.render('pages/single', { book: book });

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



	
