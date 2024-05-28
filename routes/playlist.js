const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/PlaylistController');
const authMiddleware = require('../middlewares/authMiddleware');
const pageController = require('../controllers/PageController');

router.post('/playlists', authMiddleware, playlistController.createPlaylist);
router.post('/playlists/addsongs', authMiddleware, playlistController.addSongsToPlaylist);
router.patch('/playlists/removesong', authMiddleware, playlistController.removeSongFromPlaylist);
router.get('/playlists', authMiddleware, pageController.playlists);
router.patch('/playlists/:id', authMiddleware, playlistController.updatePlaylist);
router.delete('/playlists/:id', authMiddleware, playlistController.deletePlaylist);

module.exports = router;
