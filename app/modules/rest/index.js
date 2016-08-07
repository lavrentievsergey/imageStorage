'use strict';

let express = require('express'),
	app = module.exports = express();

let load = require('project-require'),
	handlers = load('/app/libs/common/express-handlers');

let version = {
    'current': require(__dirname +'/v1')
};

/**
 * Before Action Handlers
 */
app.use(handlers.header());
app.use(handlers.promise());
app.use(handlers.response());

/**
 * The main api rout
 */
app.use('/', version.current);

/**
 * After Action Handlers
 */
app.use(handlers.outOfPromise());