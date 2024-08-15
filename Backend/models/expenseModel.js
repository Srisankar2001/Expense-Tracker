const mongoose = require('mongoose')

const expenseSchema = mongoose.Schema({
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'event', required: true },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    createdAt: { type: Date, default: Date.now },
})

const expenseModel = mongoose.model('expense', expenseSchema)

module.exports = expenseModel