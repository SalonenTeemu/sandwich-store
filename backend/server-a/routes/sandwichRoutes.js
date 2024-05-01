const sandwichController = require("../controllers/sandwichController.js");
const { protectAdmin } = require("../auth/auth.js");
const express = require("express");
const sandwichRoutes = express.Router({ mergeParams: true });

// Get sandwich utils which includes toppings and breadtypes. Does not require sign in.
sandwichRoutes.get("/sandwichUtils", sandwichController.getSandwichUtils);

// Get sandwich by id. Does not require sign in.
sandwichRoutes.get("/:sandwichId", sandwichController.getSandwichById);

// Get all sandwiches. Does not require sign in.
sandwichRoutes.get("/", sandwichController.getSandwiches)

// Add a new sandwich. Protected by sign in and admin role.
sandwichRoutes.post("/", protectAdmin, sandwichController.addSandwich);

// Edit sandwich. Protected by sign in and admin role.
sandwichRoutes.put("/:sandwichId", protectAdmin, sandwichController.updateSandwich);

// Delete sandwich. Protected by sign in and admin role.
sandwichRoutes.delete("/:sandwichId", protectAdmin, sandwichController.deleteSandwich);

module.exports = sandwichRoutes;
