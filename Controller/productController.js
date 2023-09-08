const Product = require("../model/productModel");
const ErrorHandler = require("../utils/errorHandler");
const AsyncErrorHandler = require("../middleware/asyncErrorHandler");
const ApiFeatures = require("../utils/apiFeatures");

// **************************** GET PRODUCT ****************************
exports.getAllProduct = AsyncErrorHandler(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(Product, req.query)
    .search()
    .filter()
    .pagination(10);

  console.log(await apiFeatures);

  const products = await apiFeatures.query;

  const totalProduct = await products.length;

  res.status(200).json({
    success: true,
    products,
    totalProduct,
  });
});

// **************************** CREATE PRODUCT [ADMIN] ****************************
exports.createProduct = AsyncErrorHandler(async (req, res, next) => {
  const product = await Product.create({
    ...req.body,
    userID: req.user._id,
    userName: req.user.name,
  });

  res.status(201).json({
    success: true,
    message: "Product is created",
    product,
  });
});

// **************************** UPDATE PRODUCT [ADMIN] ****************************
exports.updateProduct = AsyncErrorHandler(async (req, res, next) => {
  const { name, description, price } = req.body;

  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler(404, "Product Not Found"));
  }

  product = await Product.findOneAndUpdate(
    { _id: req.params.id },
    {
      name,
      description,
      price,
    },
    { runValidators: true, new: true }
  );

  res.status(200).json({
    success: true,
    product,
  });
});

// **************************** DELETE PRODUCT [ADMIN] ****************************
exports.deleteProduct = AsyncErrorHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler(404, "Product Not Found"));
  }

  product = await Product.findOneAndRemove({ _id: req.params.id });

  res.status(200).json({
    success: true,
    message: "Product has been deleted",
  });
});

// **************************** GET PRODUCT DETAILS ****************************
exports.getProductDetails = AsyncErrorHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id).populate(
    "userID",
    "name email"
  );

  if (!product) {
    return next(new ErrorHandler(404, "Product Not Found"));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// **************************** GET ALL REVIEW ****************************
exports.getProductReviews = AsyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.query.productID);

  if (!product) {
    return next(new ErrorHandler(404, "Product Not Found"));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// **************************** CREATE OR UPDATE REVIEW ****************************
exports.createAndUpdateReview = AsyncErrorHandler(async (req, res, next) => {
  const { rating, comment, productID } = req.body;

  const product = await Product.findById(productID);

  if (!product) {
    return next(new ErrorHandler(404, "Product Not Found"));
  }

  const existingReview = product.reviews.find((rev) => {
    return rev.userID.equals(req.user._id);
  });

  if (existingReview) {
    existingReview.name = req.user.name;
    existingReview.rating = rating;
    existingReview.comment = comment;
  } else {
    product.reviews.push({
      userID: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    });
  }

  let avgRating = 0;

  product.reviews.forEach((rev) => {
    avgRating += rev.rating;
  });

  product.numOFReviews = product.reviews.length;
  product.ratings = avgRating / product.numOFReviews;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    product,
  });
});

// **************************** REMOVE REVIEW [ADMIN] ****************************
exports.removeReview = AsyncErrorHandler(async (req, res, next) => {
  const { productID, reviewID } = req.query;

  const product = await Product.findById(productID);

  if (!product) {
    return next(new ErrorHandler(404, "Product Not Found"));
  }

  const filterReview = product.reviews.filter((rev) => {
    return rev.id !== reviewID;
  });

  product.reviews = filterReview;

  let avgRating = 0;

  product.reviews.forEach((rev) => {
    avgRating += rev.rating;
  });

  product.numOFReviews = product.reviews.length;

  product.ratings =
    avgRating / product.numOFReviews ? avgRating / product.numOFReviews : 0;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    product,
  });
});
