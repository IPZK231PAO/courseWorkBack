const express = require('express')
const router = express.Router()

const pageController = require('../controllers/PageController')
const userController = require('../controllers/UserController')
const authMiddleware = require('../middlewares/authMiddleware')
router.get('/profile', authMiddleware, pageController.profile)
// router.patch('/profile', userController.profile)

module.exports = router
