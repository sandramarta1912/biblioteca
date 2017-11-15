const async = require('async');
const crypto = require('crypto');
//const nodemailer = require('nodemailer');

const User = require('../models/user');
// var createUser = require('../models/user').createUser;

module.exports = {
	showCreate: showCreate,
	showLogin: showLogin,
    processLogin: processLogin,
	forgotPasswordShow: forgotPasswordShow,
	forgotPasswordProcess: forgotPasswordProcess,
    resetPasswordShow: resetPasswordShow,
    resetPasswordProcess: resetPasswordProcess,
	change: change
};

const passport = require("passport");

var ObjectID = require('mongodb').ObjectID;

function showCreate (req, res) {

	//var user = req.flash('user');
	//console.log(user);

	res.render('pages/users/register',{		
		errors: req.flash('errors'),
		user: new User,
		csrfToken: req.csrfToken()
	});
}

function showLogin(req, res) {
	res.render('pages/users/login', {
		user: new User,
		errors: req.flash('errors'),
		csrfToken: req.csrfToken()
	});	
}

function processLogin(req, res) {
	

    // console.log('test');
   passport.authenticate('login', {
       successRedirect: '/',
        failureRedirect: '/user/login',
       failureFlash : true
    });
}

function forgotPasswordShow(req, res) {
	res.render('pages/users/forgot-password', {
		errors: req.flash('errors'),
		csrfToken: req.csrfToken()
	});
}

// taken from http://sahatyalkabov.com/how-to-implement-password-reset-in-nodejs/
function forgotPasswordProcess(req, res, next) {
	async.waterfall([
		function(done) {
			crypto.randomBytes(20, function(err, buf) {
				var token = buf.toString('hex');
				done(err, token);
			});
		},
		function(token, done) {
			User.findOne({ 'local.email': req.body.email }, function(err, user) {
				if (!user) {
					req.flash('error', 'No account with that email address exists.');
					return res.redirect('/user/forgot-password');
				}

				user.resetPasswordToken = token;
				user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

				user.save(function(err) {
					done(err, token, user);
				});
			});
		},
		function(token, user, done) {
			var smtpTransport = nodemailer.createTransport({
				service: 'Gmail',
				auth: {
					user: 'corneliu.vesa@gmail.com',
					pass: 'tralalallallala'
				}
			});
			var mailOptions = {
				to: user.local.email,
				from: 'passwordreset@demo.com',
				subject: 'Node.js Password Reset',
				text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
				'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
				'http://' + req.headers.host + '/reset/' + token + '\n\n' +
				'If you did not request this, please ignore this email and your password will remain unchanged.\n'
			};
			smtpTransport.sendMail(mailOptions, function(err) {
				if (err) {
                    console.log(err);
                    req.flash('error', 'Email could not be sent!');
                    return res.redirect('/user/forgot-password');
                }
				req.flash('info', 'An e-mail has been sent to ' + user.local.email + ' with further instructions.');
				done(err, 'done');
			});
		}
	], function(err) {
		if (err) return next(err);
		res.redirect('/');
	});
}

// taken from http://sahatyalkabov.com/how-to-implement-password-reset-in-nodejs/
function resetPasswordShow(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/user/forgot-password');
        }
        res.render('pages/reset-password', {
            user: req.user,
			csrfToken: req.csrfToken()
        });
    });
}

function resetPasswordProcess(req, res) {
    async.waterfall([
        function(done) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
                if (!user) {
                    req.flash('error', 'Password reset token is invalid or has expired.');
                    return res.redirect('back');
                }

                user.password = req.body.password;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;

                user.save(function(err) {
                    req.logIn(user, function(err) {
                        done(err, user);
                    });
                });
            });
        },
        function(user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'corneliu.vesa@gmail.com',
                    pass: 'tralalallallala'
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'passwordreset@demo.com',
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                req.flash('success', 'Success! Your password has been changed.');
                done(err);
            });
        }
    ], function(err) {
        res.redirect('/');
    });
}

function reset (req, res) {
	res.render('pages/users/change', {
		errors: req.flash('errors'),
		csrfToken: req.csrfToken()
	});
}




function change(req, res) {
	
}

