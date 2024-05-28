const fs = require('fs')
const path = require('path')
const SongController = require('../controllers/SongController')
exports.viewsProcessing = () => {
	return new Promise((resolve, reject) => {
		fs.readdir(path.join(__dirname, '../public/views/'), (err, views) => {
			console.log(views)
			if (err) {
				reject(err)
			} else {
				console.log(`VIEWS PROCESSED: ${views}`)
				resolve(views)
			}
		})
	})
}
exports.uploadsProcessing = () => {
	return new Promise((resolve, reject) => {
		fs.readdir(path.join(__dirname, '../public/music/'), (err, uploads) => {
			if (err) {
				reject(err)
			} else {
				uploads.map(async upload => {
					try {
						const existingSong = await SongController.checkExistingSong(upload)
						if (existingSong === null) {
							await SongController.processExistingSongMetadata(upload)
							console.log('Song saved')
						}
					} catch (error) {
						console.error('failed to saving existing song (UPLOADS)')
					}
				})
				resolve(uploads)
			}
		})
	})
}
exports.deleteFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

