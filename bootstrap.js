'use strict';

let server = require('./server.js'),
	config = require('./config');

server.run(config.app.port, () => {
    console.info('Server started on port', config.app.port);
});