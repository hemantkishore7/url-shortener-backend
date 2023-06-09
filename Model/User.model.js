const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const passwordComplexity = require("joi-password-complexity")
const joi = require("joi")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        required:"Email is mandatory"
    },
    password:{
        type:String,
        required:true,
    }
})

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this._id},process.env.KEY,{
        expiresIn:"1d",
    })
    return token;
}

const user = mongoose.model("Users",userSchema)

const validate = (data) => { 
    const Schema = joi.object({
        name:joi.string().required().label("Name"),
        email:joi.string().required().label("Email"),
        password:passwordComplexity().required().label("password")
    })
    return Schema.validate(data)
}

console.log('Validate :',validate);

module.exports = {user,validate}