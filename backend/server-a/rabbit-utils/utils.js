const amqp = require("amqplib");
const { status } = require("../utils/utils");
const { setOrderStatus } = require("../services/orderService");
const env = process.env;
const host = env.RABBIT_HOST;
const taskQueue = env.TASK_QUEUE;
const readyQueue = env.READY_QUEUE;

let connection;
let sendMessage;
let currentOrders = [];

/**
 * Establishes a connection to RabbitMQ if not already established.
 * @returns {Promise<amqp.Connection>} A promise that resolves with the RabbitMQ connection.
 * @throws {Error} Error if connection establishment fails.
 */
async function createConnection() {
  try {
    if (!connection) {
      connection = await amqp.connect("amqp://" + host);
    }
    return connection;
  } catch (error) {
    console.error("Error establishing connection:", error);
    throw error;
  }
}

/**
 * Closes the RabbitMQ connection if it exists and sets failed status for orders in queue.
 * @returns {Promise<void>} A promise that resolves once the connection is closed.
 * @throws {Error} Error if closing the connection fails.
 */
async function closeConnection() {
  try {
    if (connection) {
      if (currentOrders.length !== 0) {
        currentOrders.forEach((order) => {
          setOrderStatus(order, status.FAILED);
        });
      }
      await connection.close();
      console.log("RabbitMQ connection closed.");
      connection = null;
    }
  } catch (error) {
    console.error("Error closing connection:", error);
    throw error;
  }
}

/**
 * Consumes messages from the RabbitMQ response queue.
 * @returns {Promise<void>} A promise that resolves when the consumption process completes.
 * @throws {Error} Error if an error occurs during connection establishment or message consumption.
 */
async function consumeResponse() {
  try {
    const conn = await createConnection();
    const channel = await conn.createChannel();

    await channel.assertQueue(readyQueue, { durable: true });

    console.log("Listening for messages from Server A...");
    
    channel.prefetch(1);
    channel.consume(readyQueue, handleMessage.bind(null, channel));
  } catch (error) {
    console.error("Error establishing connection:", error);
    throw error;
  }
}

/**
 * Handles the messages consumed from the message queue.
 */
function handleMessage(channel, message) {
  console.log(
    "<-- Received RESPONSE from server B:",
    message.content.toString()
  );
  channel.ack(message);
  try {
    processOrderResponse(JSON.parse(message.content.toString()));
  } catch (error) {
    console.error("Error parsing message content:", error);
    handleFailedOrder();
  }
}

/**
 * Process the messages and sets the order status based on the message success.
 */
function processOrderResponse(orderResponse) {
  const order = JSON.parse(orderResponse.order);
  if (!order) {
    handleFailedOrder();
    return;
  }
  if (orderResponse.status === status.READY) {
    console.log("Order ready: ", order);
    setOrderStatus(order, status.READY);
  } else {
    console.log("Order failed: ", order);
    setOrderStatus(order, status.FAILED);
  }
}

/**
 * Handles order that failed by using order from the current order list.
 */
function handleFailedOrder() {
  const currentOrder = currentOrders.shift();
  console.log("Order failed. Using orderlist:", currentOrder);
  setOrderStatus(currentOrder, status.FAILED);
}

/**
 * Produces messages to the RabbitMQ task queue.
 * @returns {Promise<Function>} A promise that resolves with a function to send messages.
 * @throws {Error} Error if an error occurs during connection establishment or message production.
 */
async function produceMessage() {
  try {
    const conn = await createConnection();
    const channel = await conn.createConfirmChannel();
    await channel.assertQueue(taskQueue, { durable: true });

    return async (order) => {
      try {
        currentOrders.push(order);
        await channel.sendToQueue(
          taskQueue,
          Buffer.from(JSON.stringify(order)),
          {},
          (err) => {
            if (err) {
              console.warn(new Date(), "Message nacked!");
            } else {
              console.log(new Date(), "Message acked");
            }
          }
        );
        setOrderStatus(order, status.IN_QUEUE);
        console.log("--> Sending", order);
      } catch (error) {
        console.error("Error sending message:", error);
        setOrderStatus(order, status.FAILED);
        throw error;
      }
    };
  } catch (error) {
    console.error("Error establishing connection:", error);
    throw error;
  }
}

/**
 * Starts the message production and consumption process.
 * @returns {Promise<void>} A promise that resolves once the process is started.
 */
module.exports.start = async function () {
  sendMessage = await produceMessage();
  await consumeResponse();
};

// Add event listener for process exit
process.on("exit", async (code) => {
  console.log(`Process is about to exit with code ${code}`);
  await closeConnection();
});

// Add event listener for Ctrl+C (SIGINT) signal
process.on("SIGINT", async () => {
  console.log("Received SIGINT signal");
  await closeConnection();
  process.exit(0);
});

module.exports.sendMessage = function (order) {
  if (sendMessage) {
    sendMessage(order);
  } else {
    console.error("SendMessage not initialized. Call start() first");
  }
};

module.exports.consumeResponse = consumeResponse;
module.exports.produceMessage = produceMessage;
