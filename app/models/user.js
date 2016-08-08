'use strict';

let mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs');

let UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.pre('save', function(callback) {
    let user = this;

    if (!user.isModified('password')) return callback();

    bcrypt.genSalt(5, (err, salt) => {
        if (err) return callback(err);

        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) return callback(err);
            user.password = hash;
            callback();
        });
    });
});

UserSchema.methods.verifyPassword = function(password) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, this.password, (err, isMatch) => {
            if (err) return reject(err);
            return resolve(isMatch);
        });
    });
};

module.exports = mongoose.model('User', UserSchema);