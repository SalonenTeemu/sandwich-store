"use strict";

const { setupAndConsumeMessages } = require("./rabbit-utils/utils.js");

/**
 * Start listening for incoming orders from server A.
 */
async function start() {
  try {
    await setupAndConsumeMessages();
  } catch (error) {
    console.error("Error with server B setup");
  }
}

start();
