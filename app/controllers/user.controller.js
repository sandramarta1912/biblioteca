const User = require('../models/user');
var createUser = require('../models/user').createUser;

module.exports = {
	
	showCreate: showCreate,
	processCreate: processCreate,
	showLogin: showLogin,
	processLogin: processLogin,
	change: change

}


const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy

var ObjectID = require('mongodb').ObjectID;

function showCreate (req, res) {
	res.render('pages/users/register',{		
		errors: req.flash('errors')
	});
 }

function processCreate (req, res) {
	
	// Valiation
	req.checkBody('name', 'Name is require.').notEmpty();
	req.checkBody('username', 'Username is required.').notEmpty();
	req.checkBody('email', 'Email is required.').notEmpty();
	req.checkBody('email', 'Email is not valid.').isEmail();
	req.checkBody('password', 'Password is required.').notEmpty();
	req.checkBody('password2', ' Password confirmation is not the same.').equals(req.body.password);

	// if there are errors, redirect  and save eroors to flash
	const errors = req.validationErrors();

	if (errors) {
		req.flash('errors', errors.map(err => err.msg));
		return res.redirect('/user/register');
	
	} 

	var requestBody = req.body;

	var newUser = new User({
		_id: new ObjectID(),
		name: requestBody.name,
		email: requestBody.email,
		username: requestBody.username,
		password: requestBody.password
	});

	User.createUser(newUser, (err) => {
  		if (err) {
  			return console.error(err);
  		}
		req.flash('success', 'You are register and can login!' );
		res.redirect('user/login');	
	});

}

function showLogin(req, res) {
	res.render('pages/users/login', {
		errors: req.flash('errors')
	});	
}

function processLogin(req, res) {
	console.log('test');
	passport.authenticate('login', {
		successRedirect: '/',
		failureRedirect: '/user/login',
		failureFlash : true  
	})
}

function change(req, res) {
	
}