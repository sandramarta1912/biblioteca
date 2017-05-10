const Reader = require('../models/reader');
module.exports = {

	showReaders: showReaders,
	showSingle: showSingle,
	seedreaders: seedReaders,
	showCreate: showCreate,
	processCreate: processCreate,
	deleteReader: deleteReader
	
}
function showReaders(req, res) {


		// get all books
		Reader.find({}, (err, readers) => {
			if (err) {
				res.status(404);
				res.send('Reader not found!');
			}
		//return a view with data
		res.render('pages/readers', { readers: readers });

		});

	
}

function showSingle(req,res) {
		//get a single reader
		Reader.findOne({ description:req.params.slug }, (err, reader) => {

			if (err) {
				res.status(404);
				res.send('Reader not found!');
			}

		res.render('pages/singl', { 
			reader: reader,
			success: req.flash('success')
			 });

		});

		
	}
	/**
	* Seed the database
	*/
	function seedReaders(req, res) {
		//create some books
		const books = [
			{name: 'Sandra Marta', age: '23' },
			{name: 'Sandra Cezar',  age: '25'}
			
			
		];


	// use the Book model to insert/save
		Reader.remove({}, () => {
			for(reader of readers) {
				var newReader = new Reader(reader);
				newReader.save();
			}
		});
		
		

	// seeded!
		res.send('Database seeded!');
	}


	/**
*Show the create form
*/
	function showCreate(req, res) {
		res.render('pages/creat',{
			errors: req.flash('errors')
		});
	}

/**
*Process the creation form 
*/
	function processCreate(req, res) {
		//validate information
		req.checkBody('name', 'Name is require.').notEmpty();
		req.checkBody('age', 'Description is require.').notEmpty();
		
		// if there are errors, redirect  and save eroors to flash
		const errors = req.validationErrors();

		if (errors) {
			req.flash('errors', errors.map(err => err.msg));
			return res.redirect('/readers/creat');
		}

		//create new book
		const reader = new Reader({

			name: req.body.name,
			age: req.body.age
			
		});
		//save book
	reader.save((err) =>{
		if(err)
			throw err;

		//set a successful flash message
		req.flash('success', 'Successfuly created reader!');
		//redirect to the newly created book
		res.redirect(`/readers/${reader.description}`);

	});

	}


	function deleteReader(req, res) {
		Reader.remove({ description: req.params.slug }, ( err ) => {
			//set flash data
			//redirect back to the book page
			req.flash('success', 'Reader deleted!');
			res.redirect('/readers');

		});
	}
