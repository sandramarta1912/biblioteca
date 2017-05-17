var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var PassportLocalStrategy = require('passport-local').Strategy;

var UserSchema = mongoose.Schema({
  username:{
    type: String,
    index: true,
    unique: true
  },
  password:{
    type: String
  },
  email: {
    type: String,
    unique: true
  },
  name: {
    type: String
  }
});

var User = module.exports = mongoose.model('User', UserSchema);

User.createUser = function(newUser, callback) {

    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(newUser.password, salt, function(err, hash) {
        newUser.password = hash;
        newUser.save(callback);
    });
});
 }