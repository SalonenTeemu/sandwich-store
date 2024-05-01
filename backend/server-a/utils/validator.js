const { breadTypeList, toppings, roleList } = require("./utils.js");

//Regex for email valdiation
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

/**
 * Validates whether the provided value is a valid integer ID.
 * @param {string|number} id - The value to be validated.
 * @returns {boolean} - True if the value is a valid integer ID, false otherwise.
 */
function idValidator(id) {
  return Number.isInteger(parseInt(id));
}

/**
 * Validates whether the provided order data is valid.
 * @param {Object} orderData - The data of the order to be validated.
 * @returns {boolean} - True if the order data is valid, false otherwise.
 */
function orderValidator(orderData) {
  if (
    !orderData.hasOwnProperty("sandwichId") ||
    !Number.isInteger(orderData.sandwichId)
  ) {
    return false;
  }
  if (!idValidator(orderData.sandwichId)) {
    return false;
  }
  return true;
}

/**
 * Validates whether the provided sandwich data is valid.
 * @param {Object} sandwichData - The data of the sandwich to be validated.
 * @returns {boolean} - True if the sandwich data is valid, false otherwise.
 */
function sandwichValidator(sandwichData) {
  if (!sandwichData.hasOwnProperty("name") || sandwichData.name.trim() === "") {
    return false;
  }
  if (
    !sandwichData.hasOwnProperty("toppings") ||
    !Array.isArray(sandwichData.toppings) ||
    sandwichData.toppings.length < 1
  ) {
    return false;
  }

  if (
    !sandwichData.toppings.every((item) =>
      toppings.some((topping) => topping.id === item)
    )
  ) {
    return false;
  }

  if (
    !sandwichData.hasOwnProperty("breadType") ||
    sandwichData.breadType.trim() === "" ||
    !breadTypeList.includes(sandwichData.breadType)
  ) {
    return false;
  }
  return true;
}

/**
 * Validates whether the provided user data is valid during registration.
 * @param {Object} userData - The data of the user to be validated.
 * @returns {boolean} - True if the user data is valid, false otherwise.
 */
function userValidator(userData) {
  const { email, username, password } = userData;

  if (!email || email.trim() === "" || !emailRegex.test(email)) {
    return false;
  }
  if (!username || username.trim() === "") {
    return false;
  }
  if (!password || password.trim() === "") {
    return false;
  }
  return true;
}

/**
 * Validates whether the provided user data is valid during updating user data.
 * @param {Object} userData - The data of the user to be validated.
 * @returns {boolean} - True if the user data is valid, false otherwise.
 */
function updateUserValidator(userData) {
  const { email, username, password, role } = userData;

  if (email && (email.trim() === "" || !emailRegex.test(email))) {
    return false;
  }
  if (username && username.trim() === "") {
    return false;
  }
  if (password && password.trim() === "") {
    return false;
  }
  if (role && (role.trim() === "" || !roleList.includes(role))) {
    return false;
  }
  const valid = ["email", "username", "password", "role"];
  const invalid = Object.keys(userData).filter((key) => !valid.includes(key));
  if (invalid.length > 0) {
    return false;
  }
  return true;
}

module.exports = {
  idValidator,
  orderValidator,
  sandwichValidator,
  userValidator,
  updateUserValidator,
};
