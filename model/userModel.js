const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    fname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:Number,
        required:true
    }
})

const UserDB = mongoose.model('user',userSchema)

module.exports = UserDB;