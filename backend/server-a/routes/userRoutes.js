const userController = require("../controllers/userController.js");
const { protect } = require("../auth/auth.js");
const express = require("express");
const userRoutes = express.Router({ mergeParams: true });

// Check user status whether signed in or not. Does not require sign in.
userRoutes.get("/check-status", userController.checkStatus);

// Get user by name. Protected by sign in.
userRoutes.get("/:username", protect, userController.getUserByName);

// Get all users. Protected by sign in.
userRoutes.get("/", protect, userController.getUsers);

// Login. Does not require sign in.
userRoutes.post("/login", userController.loginUser);

// Logout and clear cookie. Does not require sign in.
userRoutes.post("/logout", userController.logoutUser);

// Register. Does not require sign in.
userRoutes.post("/register", userController.createUser);

// Delete user. Protected by sign in.
userRoutes.delete("/:username", protect, userController.deleteUser);

// Edit user. Protected by sign in.
userRoutes.put("/:username", protect, userController.updateUser);

module.exports = userRoutes;
