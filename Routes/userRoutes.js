const express = require("express");
const {
  registerUser,
  userLogin,
  userLogout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  getAllUser,
  updatePassword,
  updateProfile,
  getSingleUserDetails,
  updateUserRoll,
  deleteUser,
} = require("../Controller/userController");
const {
  isAuthenticated,
  authorizedRoles,
} = require("../middleware/isAuthenticated");

const router = express.Router();

// ******************** AUTHENTICATION ROUTES********************

router.post("/register", registerUser);
router.post("/login", userLogin);
router.get("/logout", userLogout);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:token", resetPassword);

// ******************** USER ROUTES ********************

router.get("/details", isAuthenticated, getUserDetails);
router.put("/updatepassword", isAuthenticated, updatePassword);
router.put("/updateprofile", isAuthenticated, updateProfile);
router.get("/all", isAuthenticated, authorizedRoles("admin"), getAllUser);

router
  .route("/:id")
  .get(isAuthenticated, authorizedRoles("admin"), getSingleUserDetails)
  .put(isAuthenticated, authorizedRoles("admin"), updateUserRoll)
  .delete(isAuthenticated, authorizedRoles("admin"), deleteUser);

module.exports = router;
