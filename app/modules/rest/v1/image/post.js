'use strict';

let express = require('express'),
	app = module.exports = express(),
	busboy = require('connect-busboy'),
	fs = require('fs-extra'),
	load = require('project-require'),
	uploadDir = load('/config').uploadDir;

let Image = load('/app/models').Image;

app.use(busboy());

app.route('/')
    .post((req, res) => {
		let image = new Image();
		image.userAgent = req.headers['user-agent'];
		image.uuid = req.body.uuid;
		image.comment = req.body.comment;
		image.save(err => {
			if (err) console.log(err);
			else res.send(image);
		});
    });

app.route('/upload')
    .post((req, res) => {
    	let fstream,
    		filePath,
    		fileURL;
    	console.log(req.cookies);
    	console.log(req.cookies.uuid);
    	console.log(req.cookies.fileId);

        if (req.busboy) {
        	Image.findOne({_id: req.cookies.fileId, uuid: req.cookies.uuid}, (err, image) => {
        		console.log(image);
		        req.pipe(req.busboy);
		        req.busboy.on('file', (fieldname, file, filename) => {
		        	if (!filename) res.status(400).send({ message: 'Incorrect request' });

		        	console.log(filename);
		        	filePath = '/' + filename + '-' + Date.now();
		        	fileURL = req.headers.origin + filePath;
		            fstream = fs.createWriteStream(uploadDir + filePath);
		            file.pipe(fstream);
		            fstream.on('close', () => {
		            	image.path = fileURL;
		            	image.save(err => {
							if (err) res.status(500).send();
							else res.redirect(req.headers.referer);
						});
		            });
		        });
        	});
        }
        else {
        	res.status(400).send({ message: 'Incorrect request' });
        }
});