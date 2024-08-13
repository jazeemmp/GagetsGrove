const mongoose = require('mongoose')
const addressSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    fullname:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
    },
    email:{
        type:String
    },
    address:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    pincode:{
        type:String,
        required:true
    }
})
const AddressDB = mongoose.model('useraddress',addressSchema)

module.exports = AddressDB;