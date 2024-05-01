"use strict";
const SandwichModel = require("../models/sandwichModel.js");
const SandwichesToppingsModel = require("../models/sandwichesToppingsModel.js");

/**
 * Inserts sandwich to the database.
 * @param {object} sandwichData - Data of the sandwich.
 * @returns {Promise<Object>} - Returns inserted sandwich object with related toppings.
 * @throws {Error} - Throws error if insertion fails or inserted sandwich is not found.
 */
async function insertSandwich(sandwichData) {
  try {
    const sandwich = await SandwichModel.createWithToppings(sandwichData);
    if (sandwich) {
      const sandwichWithToppings = SandwichModel.query()
        .findById(sandwich.id)
        .withGraphFetched("toppings");
      return sandwichWithToppings;
    }
    throw error;
  } catch (error) {
    console.error("Error inserting sandwich:", error);
    throw error;
  }
}

/**
 * Deletes sandwich by its id from the database.
 * @param {number} sandwichId - Id of the sandwich.
 * @returns {Promise<Object>} - Returns the sandwich object.
 * @throws {Error} - Throws error if query fails.
 **/
async function removeSandwich(sandwichId) {
  try {
    return await SandwichModel.query().deleteById(sandwichId);
  } catch (error) {
    console.error("Error deleting sandwich:", error);
    throw error;
  }
}

/**
 * Fetches sandwich by its id from the database.
 * @param {number} sandwichId - Id of the sandwich.
 * @returns {Promise<Object>} - Returns the sandwich object with related toppings.
 * @throws {Error} - Throws error if query fails.
 **/
async function fetchSandwichById(sandwichId) {
  try {
    return await SandwichModel.query()
      .findById(sandwichId)
      .withGraphFetched("toppings");
  } catch (error) {
    console.error("Error fetching sandwich by id:", error);
    throw error;
  }
}

/**
 * Fetches sandwich by its name from the database.
 * @param {number} sandwichName - Name of the sandwich.
 * @returns {Promise<Object>} - Returns the sandwich object.
 * @throws {Error} - Throws error if query fails.
 **/
async function fetchSandwichByName(sandwichName) {
  try {
    return await SandwichModel.query().findOne({ name: sandwichName });
  } catch (error) {
    console.error("Error fetching sandwich by name:", error);
    throw error;
  }
}

/**
 * Fetches all sandwiches from the database.
 * @returns {Promise<Object[]>} - Returns list of sandwiches objects with related toppings.
 * @throws {Error} - Throws error if query fails.
 **/
async function fetchSandwiches() {
  try {
    return await SandwichModel.query().withGraphFetched("toppings");
  } catch (error) {
    console.error("Error fetching sandwiches:", error);
    throw error;
  }
}

/**
 * Updates sandwich by its id in the database.
 * @param {number} sandwichId - Id of the sandwich.
 * @param {number} sandwichData - Updated sandwich data to be inserted.
 * @returns {Promise<Object>} - Returns the updated sandwich object with related toppings.
 * @throws {Error} - Throws error if query fails.
 **/
async function alterSandwich(sandwichId, sandwichData) {
  try {
    const updatedSandwich = await SandwichModel.query()
      .findById(sandwichId)
      .patch({
        name: sandwichData.name,
        breadType: sandwichData.breadType,
      })
      .returning("*");

    if (!updatedSandwich) {
      return null;
    }
    const updatedToppings = await SandwichesToppingsModel.patchSandwichToppings(
      parseInt(sandwichId),
      sandwichData.toppings
    );

    if (!updatedToppings) {
      throw new Error("Error updating sandwich toppings");
    }
    const updatedSandwichWithToppings = await SandwichModel.query()
      .findById(sandwichId)
      .withGraphFetched("toppings");

    return updatedSandwichWithToppings;
  } catch (error) {
    console.error("Error updating sandwich:", error.message);
    throw error;
  }
}

module.exports = {
  fetchSandwiches,
  fetchSandwichById,
  fetchSandwichByName,
  alterSandwich,
  removeSandwich,
  insertSandwich,
};
