const User = require("../model/userModel");
const Order = require("../model/orderModels");
const Product = require("../model/productModel");
const ErrorHandler = require("../utils/errorHandler");
const AsyncErrorHandler = require("../middleware/asyncErrorHandler");
const updateStock = require("../utils/updateStock");
const { orderCancelEmail } = require("../utils/sendEmail");

// **************************** CREATE NEW ORDER ****************************
exports.newOrder = AsyncErrorHandler(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    userID: req.user._id,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
  });

  res.status(201).json({
    success: true,
    order,
  });
});

// **************************** GET SINGLE ORDER DETAIL ****************************
exports.getSingleOrderDetail = AsyncErrorHandler(async (req, res, next) => {
  const order = await Order.findOne({
    _id: req.params.id,
    userID: req.user._id,
  }).populate("userID", "name email");

  if (!order) {
    return next(new ErrorHandler(404, "Order not found"));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// **************************** GET MY ORDERS ****************************
exports.getMyOrders = AsyncErrorHandler(async (req, res, next) => {
  const orders = await Order.find({ userID: req.user._id }).populate(
    "userID",
    "name email"
  );

  res.status(200).json({
    success: true,
    orders,
  });
});

// **************************** GET ALL ORDERS [ADMIN] ****************************
exports.getAllOrders = AsyncErrorHandler(async (req, res, next) => {
  const orders = await Order.find().populate("userID", "name email role");

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    orders,
    totalAmount,
  });
});

// **************************** UPDATE ORDERS [ADMIN] ****************************
exports.updateOrder = AsyncErrorHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "userID",
    "name email role"
  );

  if (!order) {
    return next(new ErrorHandler(404, "Order not found"));
  }

  if (order.orderStatus === "delivered" || order.orderStatus === "canceled") {
    return next(
      new ErrorHandler(404, `You have already ${order.orderStatus} this order`)
    );
  }

  if (req.body.status === "shipped" && order.orderStatus === "processing") {
    order.orderStatus = req.body.status;

    order.orderItems.forEach(async (item) => {
      await updateStock(item.product, item.quantity, "minuses");
    });
  }

  if (req.body.status === "canceled") {
    if (order.orderStatus === "shipped") {
      order.orderItems.forEach(async (item) => {
        await updateStock(item.product, item.quantity, "plus");
      });
    }

    try {
      await orderCancelEmail(order, "some error");

      order.orderStatus = req.body.status;

      res.status(200).json({
        success: true,
        message: "Order has been successfully canceled",
      });
    } catch (error) {
      return next(new ErrorHandler(500, error.message));
    }
  }

  if (req.body.status === "delivered" && order.orderStatus === "shipped") {
    order.orderStatus = req.body.status;
    order.deliveredAt = new Date(Date.now());
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    order,
  });
});

// **************************** DELETE ORDERS [ADMIN] ****************************
exports.deleteOrder = AsyncErrorHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (order.orderStatus === "shipped" || order.orderStatus === "processing") {
    return next(
      new ErrorHandler(
        401,
        `Order is ${order.orderStatus} please cancel the order before deleting`
      )
    );
  }

  if (!order) {
    return next(new ErrorHandler(404, "Order not found"));
  }

  await Order.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Order is deleted successfully",
  });
});
