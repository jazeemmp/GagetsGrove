const CartDB = require('../model/cartModel')

const getCart = async (req, res) => {
 try {
  const user = req.session.user;
  const cartItems = await CartDB.findOne({user:req.session.user._id}).populate('products')
  const products = cartItems.products
  res.render('user/cart', { user, title: "cart",products});
 } catch (error) {
  console.log(error);
 }
}


const addToCart = async(req,res)=>{
  try {
    const {id} = req.params
    const userId = req.session.user._id
    await CartDB.findOneAndUpdate(
      { user: userId },
      { $push: { products: id } },
      { upsert: true } //Create new data base if doesnt exists
    );
    res.redirect('/')
  } catch (error) {
    console.log(error);
  }  
}


module.exports = {
    getCart,
    addToCart,
}