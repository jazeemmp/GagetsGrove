const ProductDB = require("../model/productModel");

const getProducts = async(req,res)=>{
     try {
       const user = req.session.user;
       const products = await ProductDB.find()
        res.render('user/index', { title:"User", products, user});
     } catch (error) {
        console.error(error);
     }
}

module.exports = {
    getProducts,
}