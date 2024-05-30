const mongoose = require('mongoose')

const songSchema = new mongoose.Schema({
	filename: { type: String, required: true },
	title: { type: String, required: true },
	artist: { type: String, required: true },
	album: String,
	genre: [{ type: String }],
	duration: { type: Number, required: true, min: 0 },
	filePath: String,
	
	createdAt: {
		type: Date,
		default: Date.now
	},
	updatedAt: {
		type: Date,
		default: Date.now
	}
})

const Song = mongoose.model('Song', songSchema)

module.exports = Song
