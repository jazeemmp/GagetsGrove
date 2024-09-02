const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    registered:{
        type:Date,
        default:Date.now()
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,     
})

const UserDB = mongoose.model('user',userSchema)

module.exports = UserDB;