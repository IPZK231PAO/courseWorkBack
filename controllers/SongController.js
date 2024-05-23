const Song = require('../models/song')
const path = require('path')
const mm = require('music-metadata')

// ? For saving EXISTING song
exports.processExistingSongMetadata = async filename => {
	try {
		console.log('PROCESS METADATA START:', filename)

		const filePath = path.join(__dirname, `../public/music/${filename}`)
		const relativePath = `/music/${filename}`
		console.log(filePath)
		const metadata = await mm.parseFile(filePath)

		const existingSong = await this.checkExistingSong(filename)
		// *Checking existing song
		if (existingSong) {
			console.log(
				`Songs Exist ${existingSong} Checking for updates in metadata`
			)
			const update = {}

			// ?Iterate over metadata fields and compare with corresponding song fields
			Object.keys(metadata.common).forEach(key => {
				if (existingSong[key] !== metadata.common[key]) {
					update[key] = metadata.common[key]
				}
			})

			// ?Check if duration is different
			const newDuration = (metadata.format.duration / 60.035).toFixed(2)
			if (existingSong.duration !== newDuration) {
				update.duration = newDuration
			}

			// ?If there are updates, perform findOneAndUpdate
			if (Object.keys(update).length > 0) {
				await Song.findOneAndUpdate({ filename: filename }, update)
				console.log(`${existingSong} metadata updated successfully`)
			} else {
				console.log('No metadata updates needed')
			}
			return { success: true, message: 'Song metadata updated' }
		}
		// *If no dublicates ---> Create new song data
		const song = await createSong(metadata, filename, relativePath)
		// * Checking song data+save
		if (song) {
			await saveSong(song)
		}
		console.log(`${song} metadata saved successfully`)
		return { success: true, message: 'Success' }
	} catch (err) {
		console.error(`Error saving song metadata: ${err}`)
		return { success: false, message: 'Error saving song' }
	}
}
exports.processNewSong = async (req, res) => {
	try {
		console.log('STARTED TO PROCESS NEW SONG', req.file.originalname)
		const { originalname } = req.file
		
		const path = `./public/music/${originalname}`
		const relativePath = `/music/${originalname}`
		console.log('PROCESSING NEW SONG: ', originalname)
		const metadata = await mm.parseFile(path)
		console.log(`METADATA OF NEW SONG: SUCCESS`)
		const existingSong = await this.checkExistingSong(originalname)
		if (existingSong) {
			return res.json({ success: false, message: 'Song already exists' })
		}
		const song = await createSong(metadata, originalname, relativePath)
		if (song) {
			await saveSong(song)
		}

		res.json({ success: true, message: 'Success' })
	} catch (error) {
		console.error(`Error saving song metadata: ${error}`)
		res.status(500).json({ success: false, message: 'Error saving song' })
	}
}
const saveSong = async song => {
	try {
		await song.save()
	} catch (error) {
		throw new Error(`Error saving song: ${error.message}`)
	}
}
const createSong = async (metadata, filename, filePath) => {
	const song = new Song({
		filename: filename,
		title: metadata.common.title || filename.substring(0, filename.length - 4),
		artist: metadata.common.artist,
		album: metadata.common.album,
		duration: (metadata.format.duration / 60.035).toFixed(2),
		filePath: filePath
	})
	return song
}
exports.checkExistingSong = async filename => {
	try {
		const existingSong = await Song.findOne({
			filename: filename
		})
		if (existingSong) {
			console.log('SONG EXIST: ', existingSong)
		}

		return existingSong
	} catch (err) {
		console.error(`Error checking existing song: ${err}`)
		throw err
	}
}
exports.getAllSongs = async (req, res) => {
	try {
		console.log(' GETTING ALL SONGS')
		const songs = await Song.find()
		for (song of songs) {
			console.log(song)
		}
		if (!songs) {
			console.error(`Error getting: ${err}`)
			return { success: false, message: 'It is not a song' }
		}
		console.log('SUCCESSFUL GET SONGS')
		console.log(songs)
		return songs
	} catch (err) {
		console.error(`Error checking existing song: ${err}`)
	}
}

exports.getSongById = async (req, res) => {
	try {
		const song = await Song.findById(req.params.id)
		if (!song) {
			return
		}
		res.json(song)
	} catch (err) {
		console.error(`Cannot get song by this ID. ${err}`)
	}
}
