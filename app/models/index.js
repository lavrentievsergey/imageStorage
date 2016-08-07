'use strict';

let mongoose = require('mongoose'),
	load = require('project-require');

let config = load('/config').db.mongo;

/**
 * DB connection
 */
mongoose.connect((config.init), (err, db) => {
	if(!err) {
	    console.log("We are connected");
	}
});

let db = {
	Image : require(__dirname + '/image'),
	User  : require(__dirname + '/user'),
	Client: require(__dirname + '/client'),
	// Code  : require(__dirname + '/code'),
	Token : require(__dirname + '/token')
}

module.exports = db;