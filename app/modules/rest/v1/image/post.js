'use strict';

let express = require('express'),
	app = module.exports = express(),
	busboy = require('connect-busboy'),
	fs = require('fs-extra'),
	load = require('project-require'),
	uploadDir = load('/config').uploadDir;

let Image = load('/app/models').Image;

app.use(busboy());

app.route('/upload')
    .post((req, res, next) => {
    	let fstream,
    		filePath,
    		fileURL;
    	console.log(req.headers);
    	console.log(req.query);
    	console.log(req.params);
    	console.log(req.body);
    	// console.log(req);
    	console.log(Object.keys(req.body).length);

        if (req.busboy) {
        	let image = new Image();
        	console.log(1);
	    	if (Object.keys(req.body).length > 0) {
	    		console.log(2);
	    		image.userAgent = req.headers['user-agent'];
	    	};
	    	console.log(3);
	    	if (req.body.comment) {
	    		console.log(4);
				image.comment = req.body.comment;
				console.log(image);
				image.save(err => {
					if (err) console.log(err);
				});
	    	}
        	// console.log(image);
        	// console.log(req.busboy);
	        req.pipe(req.busboy);
	        req.busboy.on('file', (fieldname, file, filename) => {
	        	if (!filename) res.status(400).send({ message: 'Incorrect request' });

	        	console.log(filename);
	        	filePath = '/' + filename + '-' + Date.now();
	        	fileURL = req.headers.origin + filePath;
	            fstream = fs.createWriteStream(uploadDir + filePath);
	            file.pipe(fstream);
	            fstream.on('close', () => {
	                res.redirect(req.headers.referer);
	                // res.send({ status: 200, path: fileURL });
	            });
	        });
        }
        else {
        	res.status(400).send({ message: 'Incorrect request' });
        }
});