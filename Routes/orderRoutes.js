const express = require("express");
const {
  newOrder,
  getSingleOrderDetail,
  getMyOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../Controller/orderController");
const {
  isAuthenticated,
  authorizedRoles,
} = require("../middleware/isAuthenticated");
const router = express.Router();

router.get("/all", isAuthenticated, authorizedRoles("admin"), getAllOrders);

router.post("/new", isAuthenticated, newOrder);

router.get("/my", isAuthenticated, getMyOrders);

router.put(
  "/update/:id",
  isAuthenticated,
  authorizedRoles("admin"),
  updateOrder
);

router
  .route("/:id")
  .get(isAuthenticated, getSingleOrderDetail)
  .delete(isAuthenticated, authorizedRoles("admin"), deleteOrder);

module.exports = router;
