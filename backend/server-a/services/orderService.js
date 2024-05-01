"use strict";

const OrderModel = require("../models/orderModel");
const { status } = require("../utils/utils.js");
const eventEmitter = require("../utils/eventEmitter.js");

/**
 * Inserts order to the database.
 * @param {object} orderData - Data of the order.
 * @returns {Promise<Object>} - Returns inserted order object.
 * @throws {Error} - Throws error if insertion fails.
 */
async function insertOrder(orderData, customer) {
  try {
    const order = {
      customer: customer,
      sandwichId: orderData.sandwichId,
      status: status.RECEIVED,
    };
    return await OrderModel.query().insertAndFetch(order);
  } catch (error) {
    console.error("Error inserting order:", error);
    throw error;
  }
}

/**
 * Fetches order by its id from the database.
 * @param {number} orderId - Id of the order.
 * @returns {Promise<Object>} - Returns the order object.
 * @throws {Error} - Throws error if query fails.
 **/
async function fetchOrderById(orderId) {
  try {
    return await OrderModel.query().findById(orderId);
  } catch (error) {
    console.error("Error in order by id query:", error);
    throw error;
  }
}

/**
 * Fetches all orders from the database.
 * @returns {Promise<Object[]>} - Returns list of order objects.
 * @throws {Error} - Throws error if query fails.
 **/
async function fetchOrders() {
  try {
    return await OrderModel.query();
  } catch (error) {
    console.error("Error in order query:", error);
    return null;
  }
}

/**
 * Fetches users orders from the database.
 * @returns {Promise<Object[]>} - Returns list of order objects.
 * @throws {Error} - Throws error if query fails.
 **/
async function fetchUserOrders(username) {
  try {
    return await OrderModel.query().where("customer", username);
  } catch (error) {
    console.error("Error in user order query:", error);
    throw error;
  }
}

/**
 * Updates the status of an order in the database and emits an event for order status change if the status is ready or failed.
 * @param {Object} order - The order object to update.
 * @param {string} newStatus - The new status to set for the order.
 */
async function setOrderStatus(order, newStatus) {
  try {
    await OrderModel.query().findById(order.id).patch({ status: newStatus });

    // Emit an event for order status change if the status is ready or failed
    if (newStatus === status.READY || newStatus === status.FAILED) {
      console.log("Emit new order status event for order: ", order.id);
      eventEmitter.emit("orderStatusChange", await fetchOrderById(order.id));
    }
  } catch (error) {
    console.error("Error in order query:", error);
  }
}

module.exports = {
  insertOrder,
  fetchOrderById,
  fetchUserOrders,
  fetchOrders,
  setOrderStatus,
};
