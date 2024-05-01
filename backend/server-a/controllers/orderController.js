const {
  insertOrder,
  fetchOrderById,
  fetchOrders,
  fetchUserOrders
} = require("../services/orderService.js");

const { respondWithCode, writeJson } = require("../utils/writer.js");
const { idValidator, orderValidator } = require("../utils/validator.js");
const { sendMessage } = require("../rabbit-utils/utils.js");
const eventEmitter = require("../utils/eventEmitter.js");
const SandwichModel = require("../models/sandwichModel.js");

/**
 * Retrieves all orders.
 * Admin user receives orders of all users, customer user receives own orders.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<void>} - Sends the response.
 */
async function getOrders(req, res) {
  try {
    let orders;
    if (req.user.role === "admin") {
      orders = await fetchOrders();
    }
    else {
      const username = req.user.username;
      orders = await fetchUserOrders(username);
    }
    writeJson(res, respondWithCode(200, orders));
  } catch (error) {
    writeJson(res, respondWithCode(500, { message: "Internal server error" }));
    console.error("Error getting order:", error);
  }
}

/**
 * Retrieves order by its id.
 * Successful if admin user or when the order is customer's own order.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<void>} - Sends the response.
 */
async function getOrderById(req, res) {
  try {
    const id = req.params.orderId;
    const user = req.user;
    if (!idValidator(id)) {
      writeJson(res, respondWithCode(400, { message: "Invalid request" }));
    } else {
      const order = await fetchOrderById(id);
      if (order) {
        if (user.role !== "admin" && user.username !== order.customer) {
          return writeJson(res, respondWithCode(403, { message: "Order forbidden" }));
        }
        return writeJson(res, respondWithCode(200, order));
      } else {
        writeJson(res, respondWithCode(404, { message: "Order not found" }));
      }
    }
  } catch (error) {
    writeJson(res, respondWithCode(500, { message: "Internal server error" }));
    console.error("Error getting order:", error);
  }
}

/**
 * Retrieves order details by ID and waits until the order status becomes ready or failed.
 * Sends the response to the client when the order status is ready/failed or a timeout occurs.
 * Successful if admin user or when the order is customer's own order.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<void>} - Sends the response.
 */
async function getOrderByIdWhenReady(req, res) {
  try {
    const id = req.params.orderId;
    const user = req.user;
    if (!idValidator(id)) {
      writeJson(res, respondWithCode(400, { message: "Invalid request" }));
    } else {
      const order = await fetchOrderById(id);
      if (order) {
        if (user.role !== "admin" && user.username !== order.customer) {
          return writeJson(res, respondWithCode(403, { message: "Order forbidden" }));
        }
        // Handler function to send response to client
        const handleOrderStatusChange = (data) => {
          if (data.id == id) {
            console.log("Order status change event: ", data);
            writeJson(res, respondWithCode(200, data));
            // Once status is sent, remove the listener
            eventEmitter.removeListener(
              "orderStatusChange",
              handleOrderStatusChange
            );
            return;
          }
        };

        // Listen for order status changes
        eventEmitter.on("orderStatusChange", handleOrderStatusChange);

        // Set a timeout for the request
        const timeout = setTimeout(() => {
          writeJson(res, respondWithCode(408, { message: "Request timeout" }));
          eventEmitter.removeListener(
            "orderStatusChange",
            handleOrderStatusChange
          );
        }, 60000);

        // Clear the timeout if the response is sent before the timeout occurs
        res.on("close", () => {
          clearTimeout(timeout);
        });
      } else {
        writeJson(res, respondWithCode(404, { message: "Order not found" }));
      }
    }
  } catch (error) {
    writeJson(res, respondWithCode(500, { message: "Internal server error" }));
    console.error("Error getting order:", error);
  }
}

/**
 * Adds a new order.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<void>} - Sends the response.
 */
async function addOrder(req, res) {
  try {
    const orderData = req.body;
    if (!orderData || !orderValidator(orderData)) {
      return writeJson(res, respondWithCode(400, { message: "Invalid request" }));
    }
    const sandwich = await SandwichModel.query().findById(orderData.sandwichId);
    if (!sandwich) {
      return writeJson(res, respondWithCode(404, { message: "Sandwich not found" }));
    }
    const customer = req.user.username;
    const createdOrder = await insertOrder(orderData, customer);
    writeJson(res, respondWithCode(200, createdOrder));
    sendMessage(createdOrder);
  } catch (error) {
    writeJson(res, respondWithCode(500, { message: "Internal server error" }));
    console.error("Error adding order:", error);
  }
}

module.exports = {
  getOrders,
  getOrderById,
  getOrderByIdWhenReady,
  addOrder,
};
