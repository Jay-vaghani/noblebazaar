const express = require("express");
const app = express();
const productRoute = require("./Routes/productRoutes");
const userRoute = require("./Routes/userRoutes");
const orderRoute = require("./Routes/orderRoutes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error");

// ******************** JSON ********************
app.use(express.json());
app.set("trust proxy", 1);
// ******************** COOKIE PARSER ********************
app.use(cookieParser());

// ******************** CORS ********************
app.use(
  cors({
    origin: [process.env.DOMAIN],
    methods: ["GET", "PUT", "DELETE", "POST"],
    credentials: true,
  })
);

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
