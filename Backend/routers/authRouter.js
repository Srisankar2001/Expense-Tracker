const express = require('express')
const { register, login, details, logout, verify} = require('../controllers/authController')
const router = express.Router()

router.post('/register',register)
router.post('/login',login)
router.get('/details',verify,details)
router.get('/logout',logout)

module.exports = router