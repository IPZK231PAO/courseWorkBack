const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')
const userController = require('../controllers/UserController')
const pageController = require('../controllers/PageController')

router.post('/addListened', authMiddleware, userController.addListened)
router.get('/history', authMiddleware, pageController.history)
module.exports = router
