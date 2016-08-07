'use strict';

let mongoose = require('mongoose');

let ImageSchema = new mongoose.Schema({
	name: String,
	path: String,
	comment: String,
	userAgent: String
});

// Export the Mongoose model
module.exports = mongoose.model('Image', ImageSchema);