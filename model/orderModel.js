const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    deliveryDetails: {
        type: Object,
        required: true,
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "ProductDB",
            },
            quantity: {
                type: Number,
            },
            price: {
                type: Number,
            },
            priceByQuantity: {
                type: Number,
            },
        },
    ],
    totalAmount: {
        type: Number,
    },
    paymentMethod: {
        type: String
    },
    status: {
        type: String
    },
    createdate: {
        type: Date,
        default: Date.now()
    }
});

const OrderDB = mongoose.model("order", orderSchema);

module.exports = OrderDB;
