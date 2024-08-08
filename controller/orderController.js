const CartDB = require("../model/cartModel");
const OrderDB = require("../model/orderModel");
const placeOrder = async (req, res) => {
    const cartItems = await CartDB.findOne({
        user: req.session.user._id,
    }).populate("products.productId");
    const productCount = cartItems.products.length;
    res.render("user/place-order", {
        cartItems,
        productCount,
        user: req.session.user,
        title: "Place Order",
    });
};
const postPlaceOrder = async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        address,
        pincode,
        paymentMethod,
        cartId,
    } = req.body;
    console.log(firstName, lastName, email, address, pincode, paymentMethod, cartId);

};
module.exports = {
    placeOrder,
    postPlaceOrder,
};
