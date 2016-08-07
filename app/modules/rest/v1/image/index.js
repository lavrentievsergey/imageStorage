'use strict';

let express = require('express'),
	app = module.exports = express();

let actions = {
    get: require(__dirname + '/get'),
    post: require(__dirname + '/post'),
};


app
    .use(actions.get)
    .use(actions.post)
;