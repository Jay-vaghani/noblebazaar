const express = require("express");
const {
  getAllProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createAndUpdateReview,
  removeReview,
  getProductReviews,
} = require("../Controller/productController");
const {
  isAuthenticated,
  authorizedRoles,
} = require("../middleware/isAuthenticated");

const router = express.Router();

router.get("/", getAllProduct);
router.post("/new", isAuthenticated, authorizedRoles("admin"), createProduct);

router
  .route("/review")
  .get(getProductReviews)
  .put(isAuthenticated, createAndUpdateReview)
  .delete(isAuthenticated, authorizedRoles("admin"), removeReview);

router
  .route("/:id")
  .put(isAuthenticated, authorizedRoles("admin"), updateProduct)
  .delete(isAuthenticated, authorizedRoles("admin"), deleteProduct)
  .get(getProductDetails);

module.exports = router;
