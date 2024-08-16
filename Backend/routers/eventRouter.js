const express = require('express')
const {verify} = require('../controllers/authController')
const { createEvent, getAllEvent, getOneEvent, addFriend, removeFriend, finishEvent, notFinishEvent, deleteEvent, updateEvent, budget } = require('../controllers/eventController')
const router = express.Router()

router.post('/create',verify,createEvent)
router.post('/getAll',verify,getAllEvent)
router.post('/getOne',verify,getOneEvent)
router.post('/budget',verify,budget)

router.put('/update',verify,updateEvent)
router.put('/addFriend',verify,addFriend)
router.put('/removeFriend',verify,removeFriend)

router.put('/finish',verify,finishEvent)
router.put('/notFinish',verify,notFinishEvent)

router.delete('/delete',verify,deleteEvent)

module.exports = router