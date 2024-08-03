const CartDB = require("../model/cartModel");

const getCart = async (req, res) => {
  try {
    const user = req.session.user;
    const cartItems = await CartDB.findOne({
      user: req.session.user._id,
    }).populate("products.productId");
    console.log(cartItems);

    res.render("user/cart", { user, title: "cart", cartItems });
  } catch (error) {
    console.log(error);
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, priceNum } = req.body;
    const userId = req.session.user._id;
    const isExisting = await CartDB.findOne({
      user: userId,
      "products.productId": productId,
    });
    if (isExisting) {
      await CartDB.updateOne(
        { user: userId, "products.productId": productId },
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
              productId: productId,
              quantity: 1,
              priceByQuantity: priceNum,
            },
          },
        },
        {
          upsert: true, //create new document if doest exist
        }
      );
    }
    const cart = await CartDB.findOne({ "products.productId": productId });
    const product = cart.products.find((p) => p._id.toString() === productId);
    product.priceByQuantity = priceNum * product.quantity;
    let total = 0;
    cart.products.forEach((product) => {
      total += product.priceByQuantity;
    });
    cart.total = total;
    await cart.save();
    res.json({
      success: true,
      message: "Product added to cart",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "An error occurred while adding to cart",
    });
  }
};

const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userid = req.session.user._id;
    const cart = await CartDB.findOneAndUpdate(
      { user: userid },
      { $pull: { products: { productId: id } } },
      { new: true }
    );
    let total = 0;
    cart.products.forEach((product) => {
      total += product.priceByQuantity;
    });
    cart.total = total;
    await cart.save();
    const isCartEmpty = cart.products.length === 0;
    if (isCartEmpty) {
      await CartDB.findOneAndUpdate({ user: userid }, { $set: { total: 0 } });
    }
    res.json({ productremoved: true, cartEmpty: isCartEmpty });
  } catch (error) {
    console.log(error.message);
  }
};

const changeProductQuantity = async (req, res) => {
  try {
    const { cartId, productId, count, quantity, price } = req.body;
    console.log(cartId, productId, count, quantity, price);
    if (count === -1 && quantity === 1) {
      return;
    } else {
      await CartDB.updateOne(
        { _id: cartId, "products._id": productId },
        {
          $inc: { "products.$.quantity": count },
        }
      );
      const cart = await CartDB.findOne({ "products._id": productId });
      const product = cart.products.find((p) => p._id.toString() === productId);
      product.priceByQuantity = price * product.quantity;
      let total = 0;
      cart.products.forEach((product) => {
        total += product.priceByQuantity;
      });
      cart.total = total;
      await cart.save();
      res.json({ success: true });
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  getCart,
  addToCart,
  removeProduct,
  changeProductQuantity,
};
