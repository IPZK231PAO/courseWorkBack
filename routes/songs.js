const express = require('express')
const router = express.Router()
const pageController = require('../controllers/PageController')
const authMiddleware=require('../middlewares/authMiddleware')
router.get('/library',authMiddleware, pageController.library)
module.exports = router

