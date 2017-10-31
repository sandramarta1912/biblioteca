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
	let itemsPerPage = 10;
	let currentPage = req.query.page != undefined ? req.query.page : 1;
	let offset = itemsPerPage * (currentPage - 1);
	
	// get all reader
	Reader.paginate({}, { offset: offset, limit: itemsPerPage }, function (err, result) {
		if (err) {
			res.status(404);
			return res.send('Reader not found!');
		}


		let pagination = new Pagination(req.url, result.total, itemsPerPage);

		Reader.find({}, (err, readers) => {
			if (err) {
				res.status(404);
				res.send('Books not found!');
			}
			//return a view with data

			res.render('pages/admin/readers', {
				readers: result.docs,
				pagination: pagination.paginate(),
				success: req.flash('success'),
				csrfToken: req.csrfToken()
			});
		});
	});
}

function showSingle(req,res) {



		//get a single reader
		Reader.findOne({ slug:req.params.slug }, (err, reader) => {

			if (err) {
				res.status(404);
				res.send('Reader not found!');
			}

		res.render('pages/amin/single', {
			reader: reader,
			success: req.flash('success'),
			csrfToken: req.csrfToken()
			 });

		});


		
}

/**
* Seed the database
*/
function seedReaders(req, res) {

	const readers = [
		{name: 'Sandra Marta', age: '23' },
		{name: 'Sandra Cezar',  age: '25'}
	];
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
		res.render('pages/admin/create',{
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
	req.checkBody('age', `slug is required.`).notEmpty();
	req.checkBody('age', `Age must be between 10 and 65`).isInt().gte(10).lte(65);
	req.checkBody('email', 'Email is required.').notEmpty();
	req.checkBody('email', 'Email is not valid.').isEmail();



		


	// if there are errors, redirect  and save eroors to flash
	const errors = req.validationErrors();

	if (errors) {
		req.flash('errors', errors.map(err => err.msg));
		return res.redirect('/readers/create');
	}

	//create new reader
	const reader = new Reader({

		name: req.body.name,
		email: req.body.email,
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
	Reader.findOne({slug: req.params.slug}, (err, reader) => {
		if (err) {
			res.status(404);
			return res.send('Oops... That reader does not exist!');
		}
		res.render('pages/admin/edit', {
			reader: reader,
			csrfToken: req.csrfToken()
		});
	});
}

	function processEdit(req, res) {
		req.checkBody('name', `Name is required.`).notEmpty();
		req.checkBody('age', `Age is required.`).notEmpty();

		// if there are errors, redirect  and save errors to flash
		const errors = req.validationErrors();

		if (errors) {
			req.flash('errors', errors.map(err => err.msg));
			return res.redirect(`/readers/${req.params.slug}/edit`);
		}
		Reader.findOne({slug: req.params.slug}, (err, reader) => {
			// updating that book
			reader.name = req.body.pug.name;
			reader.age = req.body.pug.age;

			reader.save((err) => {
				if (err) {
					req.flash('error', 'The book could not be updated!');
					return res.redirect(`/readers/${req.params.slug}/edit`);
				}

				// redirect back to the books
				req.flash('success', 'Successfully updated book!');
				res.redirect('admin/readers');
			});

		});
	}


	function deleteReader(req, res) {
		Reader.remove({slug: req.params.slug}, (err) => {
			//set flash data
			//redirect back to the book page
			req.flash('success', 'Reader deleted!');
			res.redirect('admin/readers');
		});
	}

