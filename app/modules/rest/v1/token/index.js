'use strict';

let express = require('express'),
	app = module.exports = express();

let actions = {
    user: require(__dirname + '/user'),
};

app.use('/user', actions.user);


