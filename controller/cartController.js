const CartDB = require("../model/cartModel");

const getCart = async (req, res) => {
  try {
    const user = req.session.user;
    const cartItems = await CartDB.findOne({
      user: req.session.user._id,
    }).populate("products.productId");
    res.render("user/cart", { user, title: "cart", cartItems });
  } catch (error) {
    console.log(error);
  }
};

const addToCart = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.user._id;
    const isExisting = await CartDB.findOne({
      user: userId,
      "products.productId": id,
    });
    if (isExisting) {
      await CartDB.updateOne(
        { user: userId, "products.productId": id },
        {
          $inc: { "products.$.quantity": 1 },
        }
      );
    } else {
      await CartDB.findOneAndUpdate(
        { user: userId },
        {
          $push: {
            products: {
              productId: id,
              quantity: 1,
            },
          },
        },
        {
          upsert: true, //create new document if doest exist
        }
      );
    }
    res.json({ message: "Product added to cart" });
  } catch (error) {
    console.log(error);
    res.json({ message: "An error occurred while adding to cart" });
  }
};

const removeProduct = async (req, res) => {
 try {
  const { id } = req.params;
  const userid = req.session.user._id;
  await CartDB.findOneAndUpdate(
    { user: userid },
    { $pull: { products: { productId: id } } },
  );
 } catch (error) {
  console.log(error.message);
 }
};

const changeProductQuantity = async (req,res)=>{
  try {
    const {cartId,productId,count} = req.body
    await CartDB.updateOne(
      { _id: cartId, "products.productId": productId },
      {
        $inc: { "products.$.quantity": count },
      }
    );
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  getCart,
  addToCart,
  removeProduct,
  changeProductQuantity
};
