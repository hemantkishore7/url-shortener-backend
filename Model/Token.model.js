const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
    userId :{
        type:mongoose.Types.ObjectId,
        ref:"user",
        required:true,
        unique:true,
    },
    token:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default: Date.now,
        expires:10000,
    }
})

module.exports = mongoose.model("Token",tokenSchema)