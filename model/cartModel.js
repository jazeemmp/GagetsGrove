const mongoose = require('mongoose')
const cartSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    products:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref:'ProductDB'
      }
    ]
})

const CartDB = mongoose.model('cart',cartSchema)

module.exports = CartDB;