const express=require('express')
const router=express.Router()
const authMiddleware=require('../middlewares/authMiddleware')
const pageController=require('../controllers/PageController')

router.get('/admin',authMiddleware , pageController.admin)

module.exports=router