const mongoose = require('mongoose')
const userModel = require('../models/userModel')
const eventModel = require('../models/eventModel')
const expenseModel = require('../models/expenseModel')

const addExpense = async(req,res)=>{
    const { _id,_eventId,name,amount} = req.body

    if (!_id || !_eventId || !amount || !name) {
        return res.status(400).json({ success: false, message: "Input nessary data" })
    }

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(_eventId)) {
        return res.status(400).json({ success: false, message: "Invalid event ID" });
    }

    try {
        const user = await userModel.findById(_id)
        const event = await eventModel.findById(_eventId)

        if (!user) {
            return res.status(400).json({ success: false, message: "User Not Found" })
        }

        if (!event) {
            return res.status(400).json({ success: false, message: "No event avalible" })
        }

        const isUserMember = event.members.includes(user._id)

        if (!isUserMember) {
            return res.status(400).json({ success: false, message: "Unauthorized access" })
        }

        const expense = new expenseModel({
            name,
            amount,
            event:event._id,
            paidBy:user._id
        })

        const savedExpense = await expense.save()

        if (!savedExpense) {
            return res.status(500).json({ success: false, message: "Can't process your request at the moment" })
        }

        return res.status(200).json({ success: false, message: "Expense saved successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

const getAllExpense = async(req,res)=>{
    const { _id,_eventId} = req.body

    if (!_id || !_eventId) {
        return res.status(400).json({ success: false, message: "Input nessary data" })
    }

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(_eventId)) {
        return res.status(400).json({ success: false, message: "Invalid event ID" });
    }

    try {
        const user = await userModel.findById(_id)
        const event = await eventModel.findById(_eventId)

        if (!user) {
            return res.status(400).json({ success: false, message: "User Not Found" })
        }

        if (!event) {
            return res.status(400).json({ success: false, message: "No event avalible" })
        }

        const isUserMember = event.members.includes(user._id)

        if (!isUserMember) {
            return res.status(400).json({ success: false, message: "Unauthorized access" })
        }

        const expense = await expenseModel.find({event : _eventId})

        return res.status(200).json({ success: false, data: expense })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

const getOneExpense = async(req,res)=>{
    const { _id,_expenseId} = req.body

    if (!_id || !_expenseId) {
        return res.status(400).json({ success: false, message: "Input nessary data" })
    }

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(_expenseId)) {
        return res.status(400).json({ success: false, message: "Invalid expense ID" });
    }

    try {
        const user = await userModel.findById(_id)
        const expense = await expenseModel.findById(_expenseId)

        if (!user) {
            return res.status(400).json({ success: false, message: "User Not Found" })
        }

        if (!expense) {
            return res.status(400).json({ success: false, message: "No expense avalible" })
        }

        const isUserMember = event.members.includes(user._id)

        if (!isUserMember) {
            return res.status(400).json({ success: false, message: "Unauthorized access" })
        }

        return res.status(200).json({ success: false, data: expense })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

const updateExpense = async(req,res)=>{
    const { _id,_expenseId,name,amount} = req.body

    if (!_id || !_expenseId || !name || !amount) {
        return res.status(400).json({ success: false, message: "Input nessary data" })
    }

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(_expenseId)) {
        return res.status(400).json({ success: false, message: "Invalid expense ID" });
    }

    try {
        const user = await userModel.findById(_id)
        const expense = await expenseModel.findById(_expenseId).populate('event').exec()

        if (!user) {
            return res.status(400).json({ success: false, message: "User Not Found" })
        }

        if (!expense) {
            return res.status(400).json({ success: false, message: "No expense avalible" })
        }

        const isUserMember = expense.event.members.includes(user._id)

        if (!isUserMember) {
            return res.status(400).json({ success: false, message: "Unauthorized access" })
        }

        expense.name = name
        expense.amount = amount

        const updatedExpense = await expense.save()

        if (!updatedExpense) {
            return res.status(500).json({ success: false, message: "Can't process your request at the moment" })
        }

        return res.status(200).json({ success: false, message: "Expense updated successfully" })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

const deleteExpense = async(req,res)=>{
    const { _id,_expenseId} = req.body

    if (!_id || !_expenseId) {
        return res.status(400).json({ success: false, message: "Input nessary data" })
    }

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(_expenseId)) {
        return res.status(400).json({ success: false, message: "Invalid expense ID" });
    }

    try {
        const user = await userModel.findById(_id)
        const expense = await expenseModel.findById(_expenseId).populate('event').exec()

        if (!user) {
            return res.status(400).json({ success: false, message: "User Not Found" })
        }

        if (!expense) {
            return res.status(400).json({ success: false, message: "No expense avalible" })
        }

        const isUserMember = expense.event.members.includes(user._id)

        if (!isUserMember) {
            return res.status(400).json({ success: false, message: "Unauthorized access" })
        }

        const deletedExpense = await expenseModel.findByIdAndDelete(_expenseId)

        if (!deletedExpense) {
            return res.status(500).json({ success: false, message: "Can't process your request at the moment" })
        }

        return res.status(200).json({ success: false, message: "Expense deleted successfully" })
        
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }
}

const expenseController = {
    addExpense,
    updateExpense,
    deleteExpense,
    getOneExpense,
    getAllExpense
}
module.exports = expenseController