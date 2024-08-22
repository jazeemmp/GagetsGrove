const CartDB = require("../model/cartModel");
const OrderDB = require("../model/orderModel");
const AddressDB = require("../model/addressModel");
const Razorpay = require("razorpay");
require('dotenv').config();
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


function generateOrderId() {
  const timestampPart = Date.now().toString().slice(-5);
  const randomPart = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0");
  return timestampPart + randomPart;
}

const getPlaceOrder = async (req, res) => {
  try {
    const cartItems = await CartDB.findOne({
      user: req.session.user._id,
    }).populate("products.productId");
    const userAddress = await AddressDB.find({ user: req.session.user._id });
    const haveCart = await CartDB.find({ user: req.session.user._id });
    if (haveCart.length === 0) {
      res.redirect("/orders");
    }
    const productCount = cartItems.products.length;
    res.render("user/place-order", {
      cartItems,
      productCount,
      userAddress,
      user: req.session.user,
      title: "Place Order",
    });
  } catch (error) {
    console.log(error);
  }
};

const addAddress = async (req, res) => {
  try {
    const { fullName, mobile, email, address, city, state, pincode } = req.body;
    const userId = req.session.user._id;
    const orderDetails = new AddressDB({
      user: userId,
      fullname: fullName,
      mobile: mobile,
      email: email,
      address: address,
      city: city,
      state: state,
      pincode: pincode,
    });
    await orderDetails.save();
    res.json({ saved: true, address: orderDetails });
  } catch (error) {
    console.log(error);
  }
};
const postPlaceOrder = async (req, res) => {
  try {
    const { addressId, paymentMethod, cartId, totalPrice } = req.body;
    let status = paymentMethod === "cod" ? "Ordered" : "pending";
    const userId = req.session.user._id;
    const userAddress = await AddressDB.findOne({ _id: addressId });
    const cartData = await CartDB.findOne({ _id: cartId }).populate(
      "products.productId"
    );
    const orderdProducts = cartData.products.map((element) => {
      let productStore = {
        productId: element.productId,
        quantity: element.quantity,
        price: element.priceByQuantity,
      };
      return productStore;
    });

    const newOrder = new OrderDB({
      orderId: generateOrderId(),
      user: userId,
      deliveryDetails: userAddress,
      products: orderdProducts,
      totalAmount: totalPrice,
      paymentMethod: paymentMethod,
      paymentStatus:"pending",
      status: status,
      orderDate: new Date(),
    });
    await newOrder.save();
    if (paymentMethod === "cod") {
      res.json({ codSuccess: true });
      await CartDB.deleteOne({ _id: cartId });
    } else if (paymentMethod === "online") {
      const options = {
        amount: newOrder.totalAmount * 100,
        currency: "INR",
        receipt:cartId,
      };
      try {
        const order = await razorpay.orders.create(options);
        res.json({order:order,orderId:newOrder._id});
      } catch (error) {
        res.send(error);
      }
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
};
const verifyPayment = async(req,res)=>{
  const crypto = require('crypto');
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature,cartId,orderId} = req.body;
  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');
  if (generated_signature === razorpay_signature) {
    res.json({ success: true, message: "Payment verified successfully!" });
    await CartDB.deleteOne({ _id: cartId });
    await OrderDB.updateOne({_id:orderId},{$set:{status:"placed",paymentStatus:"paid"}})
  } else {
    res.json({ success: false, message: "Payment verification failed!" });
  }
}
const getOrders = async (req, res) => {
  try {
    let orderdProducts = await OrderDB.find({
      user: req.session.user._id,
    }).populate("products.productId");
    const hasOrders = orderdProducts.length > 0;
    orderdProducts = orderdProducts.reverse();
    res.render("user/orders", {
      orderdProducts,
      hasOrders,
      user: req.session.user,
    });
  } catch (error) {
    console.log(error);
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const orderDetails = await OrderDB.findOne({ _id: id }).populate(
      "products.productId"
    );
    const deliveryDetails = orderDetails.deliveryDetails;
    res.render("user/view-order-details", {
      user: req.session.user,
      orderDetails,
      deliveryDetails,
    });
  } catch (error) {
    console.log(error);
  }
};

const cancelOrder = async(req,res)=>{
  const { id } = req.params;
  console.log(id)
  try {
   await OrderDB.updateOne({_id: id }, { $set: { status: "Cancelled" } });
    res.json({ success: true });
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getPlaceOrder,
  postPlaceOrder,
  addAddress,
  getOrders,
  cancelOrder,
  getOrderDetails,
  verifyPayment,
};
