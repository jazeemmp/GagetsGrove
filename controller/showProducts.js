const ProductDB = require("../model/addProducts");

const getProducts = async(req,res)=>{
     try {
        const products = await ProductDB.find()
        res.render('user/index', { title:"User", products, user:true});
     } catch (error) {
        console.error(error);
     }
}

module.exports = {
    getProducts,
}