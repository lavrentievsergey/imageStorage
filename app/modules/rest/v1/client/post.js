'use strict';

let express = require('express'),
	  app = module.exports = express(),
	  load = require('project-require');
	
let authController = load('/app/modules/rest/v1/auth');

let Client = load('/app/models').Client;

app.post('/', (req, res) => {
 	  let client = new Client();

	  client.name = req.body.name;
  	client.id = req.body.id;
  	client.secret = req.body.secret;
  	// client.userId = req.user._id;

  	client.save(err => {
        if (err) res.send(err);
	      res.json({ message: 'Client has been added!', data: client });
  	});
});