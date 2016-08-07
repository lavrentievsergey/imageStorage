'use strict';

let express = require('express'),
	app = module.exports = express(),
	path = require('path');

app.set('views', __dirname + '/views');

app.get('/', (req,res) => {
    res.sendFile(path.resolve(app.settings.views + '/main.html'));
});