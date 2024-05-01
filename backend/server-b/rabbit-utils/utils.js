const amqp = require("amqplib");

// Possible order statuses set at Server B.
const status = {
  READY: "ready",
  FAILED: "failed",
};

const env = process.env;
const host = env.RABBIT_HOST;
const taskQueue = env.TASK_QUEUE;
const readyQueue = env.READY_QUEUE;

let connection;

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
    console.error("Error establishing connection.");
    throw error;
  }
}

/**
 * Closes the RabbitMQ connection if it exists.
 * @returns {Promise<void>} A promise that resolves once the connection is closed.
 * @throws {Error} Error if closing the connection fails.
 */
async function closeConnection() {
  try {
    if (connection) {
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
 * Function to setup channels and consume messages from a RabbitMQ queue.
 */
module.exports.setupAndConsumeMessages =
  async function setupAndConsumeMessages() {
    try {
      const conn = await createConnection();
      const consumerChannel = await conn.createChannel();
      const producerChannel = await conn.createChannel();

      await consumerChannel.assertQueue(taskQueue, { durable: true });
      await producerChannel.assertQueue(readyQueue, { durable: true });

      console.log("Listening for messages...");

      consumerChannel.prefetch(1);
      consumerChannel.consume(taskQueue, async (message) => {
        if (message !== null) {
          console.log(
            "<-- Received order message from server A:",
            message.content.toString()
          );
          await sendResponse(producerChannel, message);
          consumerChannel.ack(message);
        }
      });
    } catch (error) {
      console.error("Error establishing connection.");
    }
  };

/**
 * Function to send back ready orders.
 */
async function sendResponse(channel, message) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const responseMessage = JSON.stringify({
      order: message.content.toString(),
      status: status.READY,
    });
    channel.sendToQueue(readyQueue, Buffer.from(responseMessage), {
      correlationId: message.properties.correlationId,
    });
  } catch (error) {
    const errorMessage = JSON.stringify({
      order: message.content.toString(),
      status: status.FAILED,
    });
    channel.sendToQueue(failedQueue, Buffer.from(errorMessage), {
      correlationId: message.properties.correlationId,
    });
  }
}

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
