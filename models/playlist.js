const mongoose = require('mongoose')
const Schema = mongoose.Schema

const playlistSchema = new mongoose.Schema({
	title: { type: String, required: true },
	songs: [{ type: Schema.Types.ObjectId, ref: 'Song' }],
	createdBy: {
		type: Schema.Types.ObjectId,
		ref: 'user'
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	updatedAt: {
		type: Date,
		default: Date.now
	}
})

const Playlist = mongoose.model('Playlist', playlistSchema)

module.exports = Playlist
