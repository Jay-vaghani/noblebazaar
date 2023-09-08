const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Product Name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please Enter Product Description"],
  },
  price: {
    type: Number,
    required: [true, "Please Enter Product Price"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please Enter Product Category"],
  },
  stock: {
    type: Number,
    required: [true, "Please Enter Product Stock"],
    default: 1,
  },
  numOFReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      userID: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: [true, "Please Give Rating"],
      },
      comment: {
        type: String,
        required: [true, "Please Write Comment"],
      },
    },
  ],
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  userName: {
    type: String,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Product = new mongoose.model("product", productSchema);

module.exports = Product;
