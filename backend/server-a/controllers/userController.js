//User controller
const { writeJson, respondWithCode } = require("../utils/writer.js");
const { userValidator, updateUserValidator } = require("../utils/validator.js");
const {
  checkExistingUser,
  checkExistingUserOnUserEdit,
  insertUser,
  fetchUserByName,
  fetchUsers,
  removeUser,
  alterUser,
} = require("../services/userService.js");
const {
  authenticate,
  signToken,
  clearCookieToken,
} = require("../auth/auth.js");
const UserModel = require("../models/userModel.js");

/**
 * Retrieves a user by their username and sends the user data in the response.
 * Admin user can get every user data, customer can only get own data.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - Sends the response.
 */
async function getUserByName(req, res) {
  try {
    const username = req.params.username;
    if (!username) {
      return writeJson(
        res,
        respondWithCode(400, { message: "Invalid request" })
      );
    }
    const user = await fetchUserByName(username);
    if (user) {
      if (req.user.role !== "admin" && req.user.username !== username) {
        return writeJson(
          res,
          respondWithCode(403, { message: "User forbidden" })
        );
      }
      writeJson(res, respondWithCode(200, user));
    } else {
      writeJson(res, respondWithCode(404, { message: "User not found" }));
    }
  } catch (error) {
    writeJson(res, respondWithCode(500, { message: "Internal server error" }));
  }
}

/**
 * Retrieves all users and sends the data in the response.
 * Admin user gets datalist of every user, customer receives own data.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - Sends the response.
 */
async function getUsers(req, res) {
  try {
    let users = [];
    if (req.user.role === "admin") {
      users = await fetchUsers();
    } else {
      const username = req.user.username;
      orders = await fetchUserByName(username);
      users.push(orders);
    }
    writeJson(res, respondWithCode(200, users));
  } catch (error) {
    writeJson(res, respondWithCode(500, { message: "Internal server error" }));
  }
}

/**
 * Adds a new user and sends the created user in response.
 * Checks if user with same username or email already exists.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - Sends the response.
 */
async function createUser(req, res) {
  try {
    const userData = req.body;
    if (!userData || !userValidator(userData)) {
      return writeJson(
        res,
        respondWithCode(400, { message: "Invalid request" })
      );
    }
    const existingUser = await checkExistingUser(
      userData.username,
      userData.email
    );
    if (existingUser) {
      return writeJson(
        res,
        respondWithCode(409, { message: "Email or username already in use" })
      );
    }
    const createdUser = await insertUser(userData);
    signToken(res, createdUser);
    writeJson(res, respondWithCode(200, createdUser));
  } catch (error) {
    writeJson(res, respondWithCode(500, { message: "Internal server error" }));
  }
}

/**
 * Updates user data and sends the updated user in response.
 * Admin can update every user, customer can update own data.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - Sends the response.
 */
async function updateUser(req, res) {
  try {
    const userData = req.body;
    const username = req.params.username;
    if (!userData || !username || !updateUserValidator(userData)) {
      return writeJson(
        res,
        respondWithCode(400, { message: "Invalid request" })
      );
    }
    const user = await fetchUserByName(username);
    if (!user) {
      return writeJson(
        res,
        respondWithCode(404, { message: "User not found" })
      );
    }
    if (
      req.user.role !== "admin" &&
      (req.user.username !== user.username || userData.role === "admin")
    ) {
      return writeJson(
        res,
        respondWithCode(403, { message: "User forbidden" })
      );
    }
    const existingUser = await checkExistingUserOnUserEdit(userData.email);
    if (existingUser) {
      if (user.id !== existingUser.id) {
        return writeJson(
          res,
          respondWithCode(409, { message: "Email already in use" })
        );
      }
    }
    const updatedUser = await alterUser(userData, user.id);
    writeJson(res, respondWithCode(200, updatedUser));
  } catch (error) {
    console.log(error);
    writeJson(res, respondWithCode(500, { message: "Internal server error" }));
  }
}

/**
 * Deletes user and if user deleted themselves, clears cookies.
 * Admin can delete every user, customer can delete own account.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - Sends the response.
 */
async function deleteUser(req, res) {
  try {
    const username = req.params.username;
    if (!username) {
      return writeJson(
        res,
        respondWithCode(400, { message: "Invalid request" })
      );
    }
    const user = await fetchUserByName(username);
    if (req.user.role !== "admin" && req.user.username !== user.username) {
      return writeJson(
        res,
        respondWithCode(403, { message: "User forbidden" })
      );
    }
    const deletedUser = await removeUser(username);
    if (deletedUser) {
      if (req.user.username === deletedUser.username) {
        clearCookieToken(req, res);
      }
      return writeJson(res, respondWithCode(201));
    }
    writeJson(res, respondWithCode(404, { message: "User not found" }));
  } catch (error) {
    writeJson(res, respondWithCode(500, { message: "Internal server error" }));
  }
}

/**
 * Logs in user and signs the JWT token as a cookie in the response.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - Sends the response.
 */
async function loginUser(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return writeJson(
        res,
        respondWithCode(400, { message: "Invalid request" })
      );
    }
    const user = await UserModel.getUserByNameWithPass(username);
    if (!user) {
      return writeJson(
        res,
        respondWithCode(404, { message: "User not found" })
      );
    }
    if (!(await authenticate(user, password))) {
      writeJson(res, respondWithCode(400, { message: "Invalid password" }));
    } else {
      signToken(res, user);
      const { password_hash, ...userData } = user;
      writeJson(res, respondWithCode(200, userData));
    }
  } catch (error) {
    console.log(error);
    writeJson(res, respondWithCode(500, { message: "Internal server error" }));
  }
}

/**
 * Logs out user and clears the cookie.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - Sends the response.
 */
function logoutUser(req, res) {
  try {
    clearCookieToken(req, res);
    writeJson(res, respondWithCode(204, { message: "User logged out!" }));
  } catch (error) {
    console.log(error);
    writeJson(res, respondWithCode(500, { message: "Internal server error" }));
  }
}

/**
 * Checks whether user is logged in and if is, sends user data in response.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - Sends the response.
 */
function checkStatus(req, res) {
  try {
    if (req.user) {
      return writeJson(res, respondWithCode(200, req.user));
    }
    writeJson(res, respondWithCode(204));
  } catch (error) {
    writeJson(res, respondWithCode(500, { message: "Internal server error" }));
  }
}

module.exports = {
  getUserByName,
  getUsers,
  createUser,
  loginUser,
  logoutUser,
  updateUser,
  deleteUser,
  checkStatus,
};
