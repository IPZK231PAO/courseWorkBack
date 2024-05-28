const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const pageController = require('../controllers/PageController');
const userController = require('../controllers/UserController');
const songController = require('../controllers/SongController');
const adminMiddleware = require('../middlewares/adminAccessMiddleware');

router.get('/admin', authMiddleware, pageController.admin);

router.patch('/admin/users/:id', authMiddleware,adminMiddleware, userController.updateUser);
router.delete('/admin/users/:id', authMiddleware,adminMiddleware, userController.deleteUser);
router.patch('/admin/songs/:id', authMiddleware,adminMiddleware, songController.updateSong);
router.delete('/admin/songs/:id', authMiddleware, adminMiddleware,songController.deleteSong);

module.exports = router;
