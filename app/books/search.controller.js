const Book = require('../models/book');	
module.exports = {

	searchBook: searchBook
		
		

}

function searchBook (req, res) {

	var searchTerm = req.query.term;

	Book.find({ name: {'$regex': searchTerm}}, (err, books) => {

		if (err) {
			res.status(404);
			res.send('Book not found!');
		}

		res.render(
			'pages/books/books', 
			{ 
				books: books,
				searchTerm: searchTerm,
				success: req.flash('success')
			}
		);

	});	
}
