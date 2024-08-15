const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name : { type : String, required : true },
    email : { type : String, required : true, unique : true, lowercase : true },
    password : { type : String, required : true },
    createdAt: { type: Date, default: Date.now },
    friends: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
    events:[{type: mongoose.Schema.Types.ObjectId, ref: 'event'}]
})

const userModel = mongoose.model('user',userSchema)

module.exports = userModel