const Playlist = require('../models/playlist')

exports.createPlaylist = async (req, res) => {
	try {
		console.log('Creating Playlist')
		const { id, title, songs} = req.body
		console.log(id)
		if (!req.body) {
			res.status(500).json({
				success: false,
				message: 'Помилка створення плейлісту',
				error: error
			})
		}
		const playlist = new Playlist({
			title,
			songs,
			createdBy: id
		})
		console.log('Created playlist: ', playlist)
		await playlist.save()
		console.log('saved')
		res.status(201).json({ success: true, message: 'Плейліст створено!' })
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Помилка створення плейлісту',
			error: error
		})
	}
}

exports.getPlaylist = async (req, res) => {
	try {
		console.log('Getting playlists')
		const playlist = await Playlist.findById(req.params.id).populate('songs')
		console.log('Playlists:', playlist)
		if (!playlist) {
			return res
				.status(404)
				.json({ success: false, message: 'Плейлист не знайдено' })
		}
		res.json({ success: true, playlist })
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Помилка отримання плейлісту'
		})
	}
}

exports.getAllPlaylistsById = async (id) => {
	try {
		console.log('GETTING PLAYLISTS BY USER ID:', id);
		const playlists = await Playlist.find({ createdBy: id}).populate('songs');
		console.log('GET PLAYLISTS (ID):', playlists);
		return playlists;
	} catch (error) {
		console.error('Error fetching playlists:', error);
		throw error;
	}
};

exports.getAllPlaylists = async () => {
	try {
		const playlists = await Playlist.find().populate('songs')
		console.log('Get All Playlists')
		console.log(playlists)
		return playlists
	} catch (error) {
		console.error('Error fetching playlists:', error)
		throw error
	}
}

exports.updatePlaylist = async (req, res) => {
	try {
		const {id, title, songs} = req.body
		const playlist = await Playlist.findByIdAndUpdate(
			id,
			{ title, songs, updatedAt: Date.now() },
			{ new: true }
		)
		if (!playlist) {
			return res
				.status(404)
				.json({ success: false, message: 'Плейлист не знайдено' })
		}
		res.json({ success: true, message: 'Плейліст оновлено', playlist })
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Помилка оновлення плейлісту',
			error: error
		})
	}
}

exports.deletePlaylist = async (req, res) => {
	try {
		const playlist = await Playlist.findByIdAndDelete(req.params.id)
		if (!playlist) {
			return res
				.status(404)
				.json({ success: false, message: 'Плейлист не знайдено' })
		}
		res.json({ success: true, message: 'Плейліст видалено' })
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Помилка видалення плейлісту',
			error: error
		})
	}
}
exports.addSongsToPlaylist = async (req, res) => {
	try {
		console.log('ADD SONGS TO PLAYLIST')
		const { playlistId, songIds } = req.body
		console.log('Add songs to playlist data: ', playlistId, songIds)
		const playlist = await Playlist.findByIdAndUpdate(
			playlistId,
			{ $addToSet: { songs: { $each: songIds } } },
			{ new: true }
		).populate('songs')

		if (!playlist) {
			return res
				.status(404)
				.json({ success: false, message: 'Плейлист не знайдено' })
		}

		res.json({ success: true, message: 'Пісні додано до плейлісту', playlist })
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Помилка додавання пісень до плейлісту',
			error: error.message
		})
	}
}
