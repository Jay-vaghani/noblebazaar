const express = require("express");
const app = express();
const productRoute = require("./Routes/productRoutes");
const userRoute = require("./Routes/userRoutes");
const orderRoute = require("./Routes/orderRoutes");
var cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error");

// ******************** JSON ********************
app.use(express.json());

// ******************** COOKIE PARSER ********************
app.use(cookieParser());

// ******************** ROUTES ********************
app.get("/", (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "server is running good",
  });
});
app.use("/product", productRoute);
app.use("/user", userRoute);
app.use("/order", orderRoute);

// ******************** ERROR HANDLER ********************
app.use(errorHandler);

module.exports = app;
