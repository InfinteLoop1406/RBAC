const express = require("express");
const router = express.Router();

// Import middleware
const { adminAuth } = require("../middleware/auth");

// Import controllers
const { register, login, update, deleteUser, getUsers } = require("./Auth");

// Define routes
router.route("/register").post(register); // User registration route
router.route("/login").post(login);       // User login route
router.route("/getusers").get(getUsers); // Get list of users (no middleware, public access)
router.route("/update").put(adminAuth, update); // Update user (requires admin authentication)
router.route("/delete").delete(adminAuth, deleteUser); // Delete user (requires admin authentication)

// Export the router
module.exports = router;
