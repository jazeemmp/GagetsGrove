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
    const { productId, price } = req.body;
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
              price:price,
              priceByQuantity: price,
            },
          },
        },
        {
          upsert: true, //create new document if doest exist
        }
      );
    }

    await updateTotal(productId, price, userId);

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
    res.json({ productremoved: true, cartEmpty: isCartEmpty, total });
  } catch (error) {
    console.log(error.message);
  }
};

const changeProductQuantity = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const { cartId, productId, count, quantity, price } = req.body;
    if (count === -1 && quantity === 1) {
      return;
    } else {
      await CartDB.updateOne(
        { _id: cartId, "products.productId": productId },
        {
          $inc: { "products.$.quantity": count },
        }
      );

      const total = await updateTotal(productId, price, userId);

      res.json({ success: true, total });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const updateTotal = async (productId, priceNum, userId) => {
  const cart = await CartDB.findOne({
    user: userId,
    "products.productId": productId,
  });
  const product = cart.products.find(
    (p) => p.productId.toString() === productId
  );
  product.priceByQuantity = priceNum * product.quantity;
  let total = 0;
  cart.products.forEach((product) => {
    total += product.priceByQuantity;
  });
  cart.total = total;
  await cart.save();
  return total;
};

module.exports = {
  getCart,
  addToCart,
  removeProduct,
  changeProductQuantity,
};
