const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
      required: [true, "Please enter address"],
    },
    state: {
      type: String,
      required: [true, "Please enter state"],
    },
    city: {
      type: String,
      required: [true, "Please enter city"],
    },
    pinCode: {
      type: Number,
      required: [true, "Please enter pincode"],
    },
    phone: {
      type: Number,
      required: [true, "Please enter phone number"],
    },
  },
  orderItems: [
    {
      name: {
        type: String,
        required: [true, "Please enter product name"],
      },
      price: {
        type: Number,
        required: [true, "Please enter product price"],
      },
      quantity: {
        type: Number,
        required: [true, "Please enter product quantity"],
      },
      image: {
        type: String,
        required: true,
      },
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "product",
        required: true,
      },
    },
  ],
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  paymentInfo: {
    id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  paidAt: {
    type: Date,
    required: true,
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  orderStatus: {
    type: String,
    required: true,
    default: "processing",
  },
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("order", orderSchema);

module.exports = Order;
