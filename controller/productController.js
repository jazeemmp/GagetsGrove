const ProductDB = require("../model/productModel");
const CartDB = require('../model/cartModel');
const CategoryDB = require('../model/categoryModel')

const getProducts = async(req,res)=>{
     try {
      let cartCount = 0;
      if(req.session && req.session.user && req.session.user._id) {
         const userId = req.session.user._id
         const cart = await CartDB.findOne({user:userId})
         cart?cartCount = cart.products.length:0;
         
      }
       const categories = await CategoryDB.find()
       const products = await ProductDB.find().populate('category')
        res.render('user/home-page', { products,cartCount,categories,user:req.session.user});
     } catch (error) {
        console.error(error);
     }
}

const getProductDetails = async(req,res)=>{
   const {id} = req.params
   const productDetails = await ProductDB.findOne({_id:id}).populate('category')
   res.render('user/product-details',{productDetails,user:req.session.user})
}
const getCategory = async (req,res)=>{
   const {categoryName} = req.params
   const category = await CategoryDB.findOne({slug:categoryName})
   const relatedProducts = await ProductDB.find({category:category._id})
   res.render('user/category-products',{relatedProducts,category:category.name,user:req.session.user})
}
module.exports = {
    getProducts,
    getProductDetails,
    getCategory
}