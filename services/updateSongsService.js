const SongController = require('../controllers/SongController')

exports.updateSongs = async songs => {
	const songs = SongController.getAllSongs()
	await songs.map(async song => {
		await SongController.processExistingSongMetadata(song)
	})
}
