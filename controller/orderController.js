const CartDB = require('../model/cartModel')

const placeOrder = async(req,res)=>{
    const cartItems = await CartDB.findOne({user:req.session.user._id }).populate("products.productId")
    const productCount = cartItems.products.length
    res.render('user/place-order',{cartItems,productCount,user:req.session.user,title:"Place Order"})
}
module.exports ={
    placeOrder
}