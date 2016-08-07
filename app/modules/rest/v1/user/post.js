'use strict';

let express = require('express'),
	app = module.exports = express(),
	load = require('project-require');

let User = load('/app/models').User;

app.post('/', (req, res) => {
 	var user = new User({
    	username: req.body.username,
    	password: req.body.password
  	});

  	user.save(err => {
    	if (err) res.send(err);
		res.json({ message: 'New user has been added!' });
  	});
});