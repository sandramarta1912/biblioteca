const User = require('../models/user');
const Book = require('../models/book');
const Reader = require('../models/reader');
const url = require('url');
var Pagination = require('../utils/Pagination');

const passport = require("passport");

var ObjectID = require('mongodb').ObjectID;

const async = require('async');
const crypto = require('crypto');



module.exports = {
    admin:admin,
    showReaders: showReaders,
    showBooks: showBooks,
    showCreateBook: showCreateBook,
    processCreateBook: processCreateBook,
    showCreateReader: showCreateReader,
    processCreateReader: processCreateReader
};

function admin (req, res)  {
        res.render('pages/admin/admin', {
            csrfToken: req.csrfToken()
        });
}

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



function showBooks (req, res) {
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
            res.render('pages/admin/books', {
                books: result.docs,
                pagination: pagination.paginate(),
                success: req.flash('success'),
                csrfToken: req.csrfToken()
            });

        });
    });
}
    
function showCreateBook (req, res)  {
    res.render('pages/admin/createbook',{
        errors: req.flash('errors'),
        csrfToken: req.csrfToken()
    });
}

function processCreateBook (req, res) {
//validate information
    req.checkBody('name', `Name is required.`).notEmpty();
    req.checkBody('author', `Description is required.`).notEmpty();
    req.checkBody('about', 'About is required.').notEmpty();

    // if there are errors, redirect  and save errors to flash
    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors.map(err => err.msg));
        return res.redirect('/admin/create');
    }

    //create new book
    const book = new Book({
        name: req.body.name,
        author: req.body.author,
        about: req.body.about
    });

    //save book
    book.save((err) => {
        if (err) {
            throw err;
        }
        //set a successful flash message
        req.flash('success', 'Successfuly created book!');
        //redirect to the newly created book
        res.redirect(`/books`);
    });
}

function showCreateReader(req, res) {
    res.render('pages/admin/create',{
        errors: req.flash('errors'),
        csrfToken: req.csrfToken()
    });
}


/**
 * Process the creation form
 */
function processCreateReader(req, res) {
    //validate information
    req.checkBody('name', `Name is required.`).notEmpty();
    req.checkBody('age', `Description is required.`).notEmpty();
    req.checkBody('age', `Age must be between 10 and 65`).isInt().gte(10).lte(65);
    req.checkBody('email', 'Email is required.').notEmpty();
    req.checkBody('email', 'Email is not valid.').isEmail();






    // if there are errors, redirect  and save eroors to flash
    const errors = req.validationErrors();

    if (errors) {
        req.flash('errors', errors.map(err => err.msg));
        return res.redirect('/admin/create');
    }

    //create new reader
    const reader = new Reader({

        name: req.body.name,
        email: req.body.email,
        age: req.body.age,

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
        res.redirect(`/admin/readers`);

    });
}
