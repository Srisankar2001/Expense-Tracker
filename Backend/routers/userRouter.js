const express = require('express')
const {verify} = require('../controllers/authController')
const { addFriend, removeFriend, getAllFriends, getAll } = require('../controllers/userController')
const router = express.Router()

router.post('/add',verify,addFriend)
router.post('/remove',verify,removeFriend)
router.post('/allFriend',verify,getAllFriends)
router.post('/all',verify,getAll)

module.exports = router