'use strict';

let express = require('express'),
	app = module.exports = express();

let actions = {
    post: require(__dirname + '/post'),
};


app
    .use(actions.post)
;