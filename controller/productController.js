const ProductDB = require("../model/productModel");
const CartDB = require('../model/cartModel');

const getProducts = async(req,res)=>{
     try {
      let cartCount = 0;
      if(req.session && req.session.user && req.session.user._id) {
         const userId = req.session.user._id
         const cart = await CartDB.findOne({user:userId})
         cart?cartCount = cart.products.length:0;
         
      } 
       const products = await ProductDB.find()
        res.render('user/home-page', { products,cartCount,user:req.session.user});
     } catch (error) {
        console.error(error);
     }
}

const getProductDetails = async(req,res)=>{
   const {id} = req.params
   const productDetails = await ProductDB.findOne({_id:id})
   res.render('user/product-details',{productDetails,user:req.session.user})
}
module.exports = {
    getProducts,
    getProductDetails
}