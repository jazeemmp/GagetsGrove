const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    discount:{
        type:Number,
    },
    discountedPrice:{
        type:Number,
    },
    color:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    images: [String],
})

const ProductDB = mongoose.model('ProductDB',productSchema)

module.exports = ProductDB;