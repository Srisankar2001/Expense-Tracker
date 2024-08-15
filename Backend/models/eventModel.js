const mongoose = require('mongoose')

const eventSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    createdAt: { type: Date, default: Date.now },
    budget: {type: Number, default:0},
    isFinished: {type: Boolean, default:false},
})

const eventModel = mongoose.model('event',eventSchema)

module.exports = eventModel