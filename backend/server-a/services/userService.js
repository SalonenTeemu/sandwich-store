"use strict";
const UserModel = require("../models/userModel.js");
const { encryptPassword } = require("../auth/auth.js");

/**
 * Fetches a user from the database by their username.
 * @param {string} username - The username of the user to fetch.
 * @returns {Promise<Object|null>} - User object / null if not found.
 * @throws {Error} Throws an error if there is an issue while fetching the user.
 */
async function fetchUserByName(username) {
  try {
    return await UserModel.getUserByName(username);
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

/**
 * Fetches all users from the database.
 * @returns {Promise<Array<Object>>} Array of user objects.
 * @throws {Error} Throws an error if there is an issue while fetching the users.
 */
async function fetchUsers() {
  try {
    return await UserModel.getUsers();
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

/**
 * Checks whether existing user has given email/username from the database.
 * @param {string} username - The username of the user to check.
 * @param {string} email - The email of the user to check.
 * @returns {Promise<Object>} Found user object.
 * @throws {Error} Throws an error if there is an issue while fetching the user.
 */
async function checkExistingUser(username, email) {
  try {
    return await UserModel.getExistingUser(username, email);
  } catch (error) {
    console.error("Error checking user:", error);
    throw error;
  }
}

/**
 * Checks whether existing user has given email from the database.
 * @param {string} email - The email of the user to check.
 * @returns {Promise<Object>} Found user object.
 * @throws {Error} Throws an error if there is an issue while fetching the user.
 */
async function checkExistingUserOnUserEdit(email) {
  try {
    const user = await UserModel.query()
      .where("email", email)
      .select("id", "email", "username", "role")
      .first();
    return user;
  } catch (error) {
    throw error;
  }
}

/**
 * Hashes the given password and inserts new user to the database.
 * @param {Object} userData - User data.
 * @returns {Promise<Object>} Created user object.
 * @throws {Error} Throws an error if there is an issue while creating the user.
 */
async function insertUser(userData) {
  try {
    const encryptedPassword = await encryptPassword(userData.password);
    const user = {
      email: userData.email,
      username: userData.username,
      password_hash: encryptedPassword,
    };
    const createdUser = await UserModel.query().insertAndFetch(user);
    const { password_hash, ...userNoPassHash } = createdUser;
    return userNoPassHash;
  } catch (error) {
    console.error("Error inserting user:", error);
    throw error;
  }
}

/**
 * Deletes given user from the database.
 * @param {string} username - Username of the user to delete.
 * @returns {Promise<Object>} Deleted user object.
 * @throws {Error} Throws an error if there is an issue while deleting the user.
 */
async function removeUser(username) {
  try {
    const user = fetchUserByName(username);
    await UserModel.query().delete().where("username", username);
    return user;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

/**
 * Updates given user in the database.
 * @param {Object} userData - Userdata of the user to update.
 * @param {string} userId - Id of the user to update.
 * @returns {Promise<Object>} Updated user object.
 * @throws {Error} Throws an error if there is an issue while updating the user.
 */
async function alterUser(userData, userId) {
  try {
    const { password, ...data } = userData;
    const user = {
      ...data,
    };
    if (password) {
      const encryptedPassword = await encryptPassword(password);
      user.password_hash = encryptedPassword;
    }
    const updatedUser = await UserModel.query().patchAndFetchById(userId, user);
    const { password_hash, ...userNoPassHash } = updatedUser;
    return userNoPassHash;
  } catch (error) {
    console.error("Error modifying user:", error);
    throw error;
  }
}

module.exports = {
  checkExistingUser,
  checkExistingUserOnUserEdit,
  insertUser,
  fetchUserByName,
  fetchUsers,
  removeUser,
  alterUser,
};
