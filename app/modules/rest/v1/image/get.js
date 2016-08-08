'use strict';

let express = require('express'),
	app = module.exports = express(),
	load = require('project-require');

let authController = load('/app/modules/rest/v1/auth');

let Image = load('/app/models').Image;

app.get('/', authController.bearerToken(), (req, res) => {
	// Image.find().limit(10).exec((err, images) => {
	Image.find().exec((err, images) => {
		if (err) res.status(500).send({});

		let response = {count: 0, rows: []}
		if (images.length == 0) res.send(response);
		else {
			images.forEach((image, i) => {
				response.rows.push({
					userAgent: image.userAgent,
					imageURL: image.path,
					comment: image.comment,
				});

				if (i == images.length-1) res.send(response);
			});
		}

	});
});