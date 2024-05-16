const express = require('express')
const router = express.Router()

const pageController = require('../controllers/PageController')
const authMiddleware = require('../middlewares/authMiddleware')
router.get(['/', '/home'], authMiddleware, pageController.homePage)

module.exports = router
