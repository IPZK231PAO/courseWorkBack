const express = require('express')
const router = express.Router()
const multer = require('multer')
const authMiddleware = require('../middlewares/authMiddleware')
const songController = require('../controllers/SongController')
const pageController = require('../controllers/PageController')
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/music')
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname)
	}
})

const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'audio/mpeg') {
		cb(null, true)
	} else {
		cb(new Error('Invalid file type. Only MP3 files are allowed.'))
	}
}

const upload = multer({ storage: storage, fileFilter: fileFilter })

router.get('/upload', authMiddleware, pageController.uploadPage)

router.post('/upload', upload.single('song'), songController.processNewSong)

module.exports = router
