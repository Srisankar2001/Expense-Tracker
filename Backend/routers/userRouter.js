const express = require('express')
const {verify} = require('../controllers/authController')
const { addFriend, removeFriend } = require('../controllers/userController')
const router = express.Router()

router.post('/add',verify,addFriend)
router.post('/remove',verify,removeFriend)

module.exports = router