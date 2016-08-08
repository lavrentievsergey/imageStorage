'use strict';

let mongoose = require('mongoose');

let ImageSchema = new mongoose.Schema({
	path: String,
	comment: String,
	uuid: String,
	userAgent: String
});

// Export the Mongoose model
module.exports = mongoose.model('Image', ImageSchema);