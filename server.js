'use strict';

/**
 * Require modules
 */
let express = require('express'),
	app = express(),
	server = require('http').Server(app),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	passport = require('passport'),
	path = require('path'),
	async = require('async'),
	morgan = require('morgan'),
	load = require('project-require');

/**
 * Modules
 */
let rest = load('/app/modules/rest');

function uncaughtException(err) {
    console.log(err);
    console.error(err.stack || err);
}

process.on('uncaughtException', (err) => {
    uncaughtException(err);
});

function start(port, callback) {
    let instance;

    // Configuration
    app.use(cookieParser());
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({ 
    	extended: true,
    	parameterLimit: 100000, 
    	limit: '50mb'
    }));

    app.use(morgan('combined'));

    app.use(passport.initialize());
    app.use(passport.session());

    // Use rest module
    app.use(rest);

    let steps = [
        fn => {
            instance = server.listen(port, null, null, (err) =>  fn(err, instance));
        }
    ];

    async.waterfall(steps, (err, instance) => {
        if (err) console.error(err.stack || err);
        callback(err, instance);
    });
}

function run(port, callback) {
    return callAsync(cb => {
        try {
            start(port, (err, instance) => {
                if (callback) callback(err, instance);
                cb(err, instance);
            });
        }
        catch (err) {
            uncaughtException(err);
        }
    });
}

function callAsync(fn) {
    return new Promise((resolve, reject) => {
        fn((err, result) => {
            if (err) {
                return reject(err);
            } else {
                return resolve(result);
            }
        });
    });
}

module.exports = {
    run: run
};