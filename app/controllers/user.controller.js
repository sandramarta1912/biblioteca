const User = require('../models/user');
var createUser = require('../models/user').createUser;
module.exports = {

	
	showCreate: showCreate,
	processCreate: processCreate,
	showLogin: showLogin,
	

}


var passport = require("passport");
var ObjectID = require('mongodb').ObjectID;

function showCreate (req, res) {
	res.render('pages/register',{
		
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
		res.redirect('/user/register');	
	});

}

function showLogin(req, res) {

  if(req.method.toLowerCase() != "post") {
    res.render('pages/login');
  }
  else {
    user.findOne({email: req.body.email}, function(err, result) {
       if(err) console.log(err);

         if(result == null) {
           res.send('invalid username', 
		    {'Content-type' : 'text/plain'}, 
                    403);
         }
	 else {
           auth(result);
         }
    });

    function auth( userRes ) {
      if(!UserModel.encrypt(req.body.password) == userRes.password) {
         res.send('invalid password', 
		  {'Content-type' : 'text/plain'}, 
                  403);
      } else {
         console.log(userRes._id);
         user.update({_id : userRes._id}, {'$set' : {token : Date.now}});
         res.send(userRes);
      }
    }
  }
}