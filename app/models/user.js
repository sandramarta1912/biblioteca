var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');



var PassportLocalStrategy = require('passport-local').Strategy;

var UserSchema = mongoose.Schema({
    local: {
        email: {
            type: String,
            unique: true

        },
        password: String,
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        roles: {
            type: [{
                type: String,
                enum: ['regular', 'admin']

            }]
        }
        
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    }
});

// generating a hash
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', UserSchema);
