'use strict';

let config = {
    security: {
        tokenLife: 60 * 60 * 24 // 24 hours
    },
    app: {
        port: 3000,
        testPort: 3333
    },
    db: {
    	mongo: {
    		init: 'mongodb://localhost:27017/imageStorage'
    	}
    },
    uploadDir: __dirname + '/../uploads',
    security: {
        checkBearer: true,
        tokenLife: 86400
    },
};

module.exports = config;