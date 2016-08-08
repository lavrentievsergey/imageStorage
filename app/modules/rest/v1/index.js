'use strict';

let express = require('express'),
	app = module.exports = express(),
	router = express.Router();

// Available modules in v1
let v1Module = {
	uploader: require(__dirname + '/static/user'),
	admin: require(__dirname + '/static/admin'),
	image: require(__dirname + '/image'),
	user: require(__dirname + '/user'),
	client: require(__dirname + '/client'),
	token: require(__dirname + '/token'),
};

// Active modules
app
    .use('/uploader', v1Module.uploader)
    .use('/admin', v1Module.admin)
    .use('/api/image', v1Module.image)
    .use('/api/user', v1Module.user)
    .use('/api/token', v1Module.token)
    .use('/api/client', v1Module.client)
;