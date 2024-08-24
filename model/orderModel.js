const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
    orderId :{
        type:Number
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
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
        },
    ],
    totalAmount: {
        type:Number,
    },
    paymentMethod: {
        type: String
    },
    paymentStatus:{
        type:String,
    },
    status: {
        type: String
    },
    statusUpdatedDate: {  
        type: Date,
    },
    orderDate: {
        type: Date,
        default: Date.now()
    }
});

// Pre-save middleware to update `statusUpdatedDate` if `status` changes
orderSchema.pre("save", function (next) {
    if (this.isModified("status")) {  
        this.statusUpdatedDate = new Date();
    }
    next();
});

const OrderDB = mongoose.model("order", orderSchema);

module.exports = OrderDB;
