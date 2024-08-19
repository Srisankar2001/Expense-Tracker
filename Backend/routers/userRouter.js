const express = require('express')
const {verify} = require('../controllers/authController')
const { addFriend, removeFriend, getAllFriends } = require('../controllers/userController')
const router = express.Router()

router.post('/add',verify,addFriend)
router.post('/remove',verify,removeFriend)
router.post('/allFriend',verify,getAllFriends)

module.exports = router