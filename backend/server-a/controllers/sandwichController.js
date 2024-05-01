//Sandwich controller
const {
  fetchSandwiches,
  fetchSandwichById,
  fetchSandwichByName,
  insertSandwich,
  alterSandwich,
  removeSandwich,
} = require("../services/sandwichService.js");

const { breadTypeList, toppings } = require("../utils/utils.js");
const { respondWithCode, writeJson } = require("../utils/writer.js");
const { idValidator, sandwichValidator } = require("../utils/validator.js");

/**
 * Retrieves breadtypes and toppings.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<void>} - Sends the response.
 */
async function getSandwichUtils(req, res) {
  try {
    const response = {
      breadTypes: breadTypeList,
      toppings: toppings,
    };
    writeJson(res, respondWithCode(200, response));
  } catch (error) {
    writeJson(res, respondWithCode(500, { message: "Internal server error" }));
  }
}

/**
 * Retrieves all sandwiches.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<void>} - Sends the response.
 */
async function getSandwiches(req, res) {
  try {
    const sandwiches = await fetchSandwiches();
    writeJson(res, respondWithCode(200, sandwiches));
  } catch (error) {
    writeJson(res, respondWithCode(500, { message: "Internal server error" }));
  }
}

/**
 * Retrieves sandwich by its id.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<void>} - Sends the response.
 */
async function getSandwichById(req, res) {
  try {
    const id = req.params.sandwichId;
    if (!idValidator(id)) {
      writeJson(res, respondWithCode(400, { message: "Invalid request" }));
    } else {
      const sandwich = await fetchSandwichById(id);
      if (sandwich) {
        writeJson(res, respondWithCode(200, sandwich));
        return;
      }
      writeJson(res, respondWithCode(404, { message: "Sandwich not found" }));
    }
  } catch (error) {
    writeJson(res, respondWithCode(500, { message: "Internal server error" }));
  }
}

/**
 * Adds a new sandwich. Checks if a sandwich with the same name already exists.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<void>} - Sends the response.
 */
async function addSandwich(req, res) {
  try {
    const sandwichData = req.body;
    if (!sandwichData || !sandwichValidator(sandwichData)) {
      writeJson(res, respondWithCode(400, { message: "Invalid request" }));
    } else {
      const existingSandwich = await fetchSandwichByName(sandwichData.name);
      if (existingSandwich) {
        writeJson(
          res,
          respondWithCode(409, { message: "Sandwich already exists" })
        );
        return;
      }
      const createdSandwich = await insertSandwich(sandwichData);
      writeJson(res, respondWithCode(201, createdSandwich));
    }
  } catch (error) {
    writeJson(res, respondWithCode(500, { message: "Internal server error" }));
  }
}

/**
 * Updates a sandwich by its id. Checks if a sandwich with the same name trying to update to already exists.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<void>} - Sends the response.
 */
async function updateSandwich(req, res) {
  try {
    const sandwichData = req.body;
    const sandwichId = req.params.sandwichId;
    if (
      !sandwichData ||
      !sandwichValidator(sandwichData) ||
      !idValidator(sandwichId)
    ) {
      writeJson(res, respondWithCode(400, { message: "Invalid request" }));
    } else {
      const existingSandwich = await fetchSandwichByName(sandwichData.name);
      if (existingSandwich && existingSandwich.id !== parseInt(sandwichId)) {
        return writeJson(
          res,
          respondWithCode(409, { message: "Sandwich already exists" })
        );
      }
      const updatedSandwich = await alterSandwich(sandwichId, sandwichData);
      if (updatedSandwich) {
        writeJson(res, respondWithCode(200, updatedSandwich));
        return;
      }
      writeJson(res, respondWithCode(404, { message: "Sandwich not found" }));
    }
  } catch (error) {
    writeJson(res, respondWithCode(500, { message: "Internal server error" }));
  }
}

/**
 * Deletes a sandwich by its id.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<void>} - Sends the response.
 */
async function deleteSandwich(req, res) {
  try {
    const sandwichId = req.params.sandwichId;
    if (!idValidator(sandwichId)) {
      writeJson(res, respondWithCode(400, { message: "Invalid request" }));
    } else {
      const deletedSandwich = await removeSandwich(sandwichId);
      if (deletedSandwich) {
        writeJson(res, respondWithCode(204));
        return;
      }
      writeJson(res, respondWithCode(404, { message: "Sandwich not found" }));
    }
  } catch (error) {
    writeJson(res, respondWithCode(500, { message: "Internal server error" }));
  }
}

module.exports = {
  getSandwichUtils,
  getSandwiches,
  getSandwichById,
  addSandwich,
  updateSandwich,
  deleteSandwich,
};
