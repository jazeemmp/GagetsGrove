const mongoose = require('mongoose')
const cartSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    products:[{
        productId:{
          type: mongoose.Schema.Types.ObjectId,
          ref:'ProductDB'
        },
        quantity:{
          type:Number
        },
        priceByQuantity:{
          type:Number
        }
       }],
    total:{
      type:Number,
      default:0
    }
})

const CartDB = mongoose.model('cart',cartSchema)

module.exports = CartDB;