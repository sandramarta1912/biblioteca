const Reader = require('../models/reader'),
	url = require('url');
var Pagination = require('../utils/Pagination');



module.exports = {
	showReaders: showReaders,
	showSingle: showSingle,
	seedreaders: seedReaders,
	showCreate: showCreate,
	processCreate: processCreate,
	showEdit: showEdit,
	processEdit: processEdit,
	deleteReader: deleteReader
	
};

function showReaders(req, res) {
	let itemsPerPage = 3;
	let currentPage = req.query.page != undefined ? req.query.page : 1;
	let offset = itemsPerPage * (currentPage - 1);
	
	// get all reader
	Reader.paginate({}, { offset: offset, limit: itemsPerPage }, function (err, result) {
		if (err) {
			res.status(404);
			return res.send('Reader not found!');
		}

		let pagination = new Pagination(req.url, result.total, itemsPerPage);
		
		//return a view with data

		res.render('pages/readers/readers', {
			readers: result.docs,
			pagination: pagination.paginate(),
			success: req.flash('success')
		});
	});
}

function showSingle(req,res) {

	//get a single reader
	Reader.findOne({ description:req.params.slug }, (err, reader) => {
		if (err) {
			res.status(404);
			return res.send('Reader not found!');
		}
	});

		//get a single reader
		Reader.findOne({ description:req.params.slug }, (err, reader) => {

			if (err) {
				res.status(404);
				res.send('Reader not found!');
			}

		res.render('pages/readers/singl', { 
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
* Show the create form
*/


	function showCreate(req, res) {
		res.render('pages/readers/creat',{
			errors: req.flash('errors')
		});
	}


/**
* Process the creation form
*/
function processCreate(req, res) {
	//validate information
	req.checkBody('name', `Name is required.`).notEmpty();
	req.checkBody('age', `Description is required.`).notEmpty();
	req.checkBody('age', `Age must be between 10 and 65`).isInt().gte(10).lte(65);



		if (errors) {
			req.flash('errors', errors.map(err => err.msg));
			return res.redirect('/readers/create');
		}


	// if there are errors, redirect  and save eroors to flash
	const errors = req.validationErrors();

	if (errors) {
		req.flash('errors', errors.map(err => err.msg));
		return res.redirect('/readers/create');
	}

	//create new reader
	const reader = new Reader({

		name: req.body.name,
		age: req.body.age

	});
	
	//save reader
	reader.save((err, reader) =>{
		if(err){
			req.flash('errors', 'The reader could not be created. There are errors!');
			return res.redirect('/readers/create');
		}
		//set a successful flash message
		req.flash('success', 'Successfuly created reader!');
		//redirect to the newly created reader
		res.redirect(`/readers`);

	});
}

/**
 * Show the edit form
 */
function showEdit (req, res) {
	Reader.findOne({description: req.params.slug }, (err, reader) => {
		if (err) {
			res.status(404);
			return res.send('Oops... That reader does not exist!');
		}
		res.render('pages/readers/edit', {
		reader: reader
	});
});
}

/**
 * process the edit form
 */

function processEdit (req, res) {
	req.checkBody('name', `Name is required.`).notEmpty();
	req.checkBody('age', `Age is required.`).notEmpty();

	// if there are errors, redirect  and save errors to flash
	const errors = req.validationErrors();

	if (errors) {
		req.flash('errors', errors.map(err => err.msg));
		return res.redirect(`/readers/${req.params.slug}/edit`);
	}
	Reader.findOne({ description: req.params.slug }, (err, reader) => {
		// updating that book
		reader.name   = req.body.name;
		reader.age = req.body.age;

		reader.save((err) => {
			if(err) {
				req.flash('error', 'The book could not be updated!');
				return res.redirect(`/readers/${req.params.slug}/edit`);
			}

			// redirect back to the books
			req.flash('success', 'Successfully updated book!');
			res.redirect('/readers');
		});

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
