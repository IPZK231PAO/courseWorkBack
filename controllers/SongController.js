const Song = require('../models/song')
const path = require('path')
const mm = require('music-metadata')
const filesController=require('./FilesController')

exports.processExistingSongMetadata = async filename => {
	try {
		console.log('PROCESS METADATA START:', filename)

		const filePath = path.join(__dirname, `../public/music/${filename}`)
		const relativePath = `/music/${filename}`
		console.log(filePath)
		const metadata = await mm.parseFile(filePath)

		const existingSong = await this.checkExistingSong(filename)
		if (existingSong) {
			console.log(
				`Songs Exist ${existingSong} Checking for updates in metadata`
			)
			const update = {}

			Object.keys(metadata.common).forEach(key => {
				if (existingSong[key] !== metadata.common[key]) {
					update[key] = metadata.common[key]
				}
			})

			const newDuration = (metadata.format.duration / 60.035).toFixed(2)
			if (existingSong.duration !== newDuration) {
				update.duration = newDuration
			}

			if (Object.keys(update).length > 0) {
				await Song.findOneAndUpdate({ filename: filename }, update)
				console.log(`${existingSong} metadata updated successfully`)
			} else {
				console.log('No metadata updates needed')
			}
			return { success: true, message: 'Song metadata updated' }
		}
		const song = await createSong(metadata, filename, relativePath)
		if (song) {
			await saveSong(song)
		}
		console.log(`${song} metadata saved successfully`)
		return { success: true, message: 'Вдало оновлено пісні' }
	} catch (err) {
		console.error(`Error saving song metadata: ${err}`)
		return { success: false, message: 'Помилка обробки наявних пісень' }
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
		console.log(metadata)
		if ((metadata.common.title === '') || ( metadata.common.artist === '')) {
			filesController.deleteFile(path)
			res.status(400).json({ success: false, message: 'Назва або виконавець повинні бути вказані' });
		}
		if (!metadata.common.album || metadata.common.album === '') {
			metadata.common.album = 'Сингл';
		}
		if (!metadata.common.genre || metadata.common.genre === '') {
			metadata.common.genre = 'Інший';
		}
		console.log(`METADATA OF NEW SONG: SUCCESS`)
		const existingSong = await this.checkExistingSong(originalname)
		if (existingSong) {
		
			return res.json({ success: false, message: 'Така пісня вже є' })
		}
		const song = await createSong(metadata, originalname, relativePath)
		if (song) {
			await saveSong(song)
		}
		res.json({ success: true, message: 'Пісня додана! Дякуємо за Вашу творчість!' })
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

exports.updateSong = async (req, res) => {
    try {
        console.log('UPDATING SONG')
        const { id } = req.params
        const updates = req.body
		console.log(req.params)
		console.log(updates)
        const song = await Song.findByIdAndUpdate(id, updates, { new: true })

        if (!song) {
            return res.status(404).json({ success: false, message: 'Пісню не знайдено' })
        }
        res.json({ success: true, message: 'Пісню оновлено', song })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Помилка оновлення пісні',
            error: error.message
        })
    }
}


exports.deleteSong = async (req, res) => {
    try {
        console.log('DELETING SONG');
        const song = await Song.findByIdAndDelete(req.params.id);
        if (!song) {
            return res.status(404).json({ success: false, message: 'Пісня не знайдена' });
        }

        const filePath = path.join(__dirname, '..', 'public', 'music', song.filename);
		console.log(filePath)
        await filesController.deleteFile(filePath);

        res.json({ success: true, message: 'Пісню видалено' });
    } catch (error) {
        console.error('Error deleting song:', error);
        res.status(500).json({
            success: false,
            message: 'Помилка видалення пісні',
            error: error.message
        });
    }
};


