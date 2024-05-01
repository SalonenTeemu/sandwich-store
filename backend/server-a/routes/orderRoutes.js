const orderController = require("../controllers/orderController.js");
const { protect } = require("../auth/auth.js");
const express = require("express");
const orderRoutes = express.Router({ mergeParams: true });

// Get order by id. Protected by sign in.
orderRoutes.get("/:orderId", protect, orderController.getOrderById);

// Get order status by id. Protected by sign in.
orderRoutes.get("/:orderId/status", protect, orderController.getOrderByIdWhenReady);

// Get orders. Protected by sign in.
orderRoutes.get("/", protect, orderController.getOrders);

// Add order. Protected by sign in.
orderRoutes.post("/", protect, orderController.addOrder);

module.exports = orderRoutes;
