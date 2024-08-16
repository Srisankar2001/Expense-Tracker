const express = require('express')
const { verify } = require('../controllers/authController')
const { addExpense, updateExpense, deleteExpense, getOneExpense, getAllExpense } = require('../controllers/expenseController')
const router = express.Router()

router.post('/add',verify,addExpense)
router.post('/getOne',verify,getOneExpense)
router.post('/getAll',verify,getAllExpense)

router.put('/update',verify,updateExpense)

router.delete('/delete',verify,deleteExpense)

module.exports = router