const mongoose = require('mongoose')

const songSchema = new mongoose.Schema({
	filename: String,
	title: String,
	artist: String,
	album: String,
	genre: [{ type: String }],
	duration: Number || String,
	filePath: String
})

const Song = mongoose.model('Song', songSchema)

module.exports = Song
