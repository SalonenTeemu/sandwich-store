import { createNotification } from "./notificationActions.js";

const url = "http://localhost:3000/";

/**
 * Messages for various order-related notifications.
 */
const orderMsg = {
  loading: "Loading...",
  loaded: "Order(s) loaded successfully.",
  loadedError: "Error with loading order(s).",
  added: "New order received.",
  addedError: "Error with receiving order.",
};

/**
 * Retrieves orders from the server.
 * Dispatches actions to update current orders and create notifications.
 */
export const getOrders = () => {
  return async (dispatch) => {
    dispatch(createNotification("order", orderMsg.loading, "loading"));
    const response = await fetch(`${url}order/`, { credentials: "include" });
    const data = await response.json();

    if (!response.ok) {
      return dispatch(
        createNotification("order", orderMsg.loadedError, "error")
      );
    }

    dispatch({
      type: "GET_ORDERS",
      payload: data,
    });
    dispatch(createNotification("order", orderMsg.loaded, "success"));
  };
};

/**
 * Retrieves a specific order by its ID from the server.
 * Dispatches actions to update current orders and create notifications.
 * @param {number} orderId - The ID of the order to retrieve.
 */
export const getOrderById = (orderId) => {
  return async (dispatch) => {
    dispatch(createNotification("order", orderMsg.loading, "loading"));
    const response = await fetch(`${url}order/${orderId}`, {
      credentials: "include",
    });
    const data = await response.json();

    if (!response.ok) {
      return dispatch(
        createNotification("order", orderMsg.loadedError, "error")
      );
    }

    dispatch({
      type: "GET_ORDER",
      payload: data,
    });
    dispatch(createNotification("order", orderMsg.loaded, "success"));
  };
};

/**
 * Adds a new order to the server.
 * Dispatches actions to update current orders, create notifications and to start long polling for the order status.
 * @param {Object} newOrder - The new order object to be added.
 */
export const addOrder = (newOrder) => {
  return async (dispatch) => {
    dispatch(createNotification("order", orderMsg.loading, "loading"));
    const response = await fetch(`${url}order`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(newOrder),
    });
    const data = await response.json();

    if (!response.ok) {
      return dispatch(
        createNotification("order", orderMsg.addedError, "error")
      );
    }
    dispatch({
      type: "ADD_ORDER",
      payload: data,
    });
    dispatch(createNotification("order", orderMsg.added, "success"));

    dispatch(getOrders());

    // Start long polling for the order status
    dispatch(longPollForOrderById(data.id));
  };
};

/**
 * Long-polls the server for the status of a specific order.
 * Dispatches actions to update current orders and create notifications.
 * @param {number} orderId - The ID of the order to poll.
 */
export const longPollForOrderById = (orderId) => {
  return async (dispatch) => {
    const controller = new AbortController();
    const signal = controller.signal;

    const timeoutDuration = 60000;

    // Start timeout timer
    const timeoutId = setTimeout(() => {
      controller.abort();
      dispatch(
        createNotification(
          "order",
          `Order with ID: ${orderId} failed.`,
          "error"
        )
      );
    }, timeoutDuration);

    try {
      const response = await fetch(
        `${url}order/${orderId}/status`,
        { credentials: "include" },
        { signal }
      );
      const data = await response.json();

      if (!response.ok) {
        return dispatch(
          createNotification(
            "order",
            `Order with ID: ${orderId} failed.`,
            "error"
          )
        );
      }

      dispatch({
        type: "GET_ORDER",
        payload: data,
      });
      dispatch(
        createNotification(
          "order",
          `Order with ID: ${orderId} is now ready.`,
          "success"
        )
      );
    } catch (error) {
      if (error.name === "AbortError") {
        console.error("Request timed out");
      } else {
        console.error("Fetch error:", error.message);
      }
    } finally {
      clearTimeout(timeoutId);
    }
  };
};
