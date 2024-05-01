const { Model } = require("objection");

/**
 * Represents the User model.
 */
class UserModel extends Model {
  /**
   * Returns the table name for the User model.
   * @returns {string} The table name.
   */
  static get tableName() {
    return `users`;
  }

  /**
   * Returns the JSON schema for the User model.
   * @returns {Object} The JSON schema.
   */
  static get jsonSchema() {
    return {
      type: "object",
      required: ["email", "username", "password_hash"],
      properties: {
        id: { type: "integer" },
        role: { type: "string", minLength: 1, maxLength: 255 },
        email: { type: "string", minLength: 1, maxLength: 255 },
        username: { type: "string", minLength: 1, maxLength: 255 },
        password_hash: { type: "string", minLength: 1, maxLength: 255 },
      },
    };
  }

  /**
   * Retrieves a user from the database by their username.
   * @param {string} username - The username of the user to retrieve.
   * @returns {Promise<Object|null>} A promise that resolves with the user object if found, or null if not found.
   * @throws {Error} Throws an error if there is an issue while retrieving the user.
   */
  static async getUserByName(username) {
    try {
      const user = await UserModel.query()
        .where("username", username)
        .select("id", "email", "username", "role")
        .first();
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves a user from the database by their username including the password hash.
   * @param {string} username - The username of the user to retrieve.
   * @returns {Promise<Object|null>} A promise that resolves with the user object if found, or null if not found.
   * @throws {Error} Throws an error if there is an issue while retrieving the user.
   */
  static async getUserByNameWithPass(username) {
    try {
      const user = await UserModel.query().where("username", username).first();
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves all users from the database.
   * @returns {Promise<Array<Object>>} A promise that resolves with an array of user objects.
   * @throws {Error} Throws an error if there is an issue while retrieving the users.
   */
  static async getUsers() {
    try {
      const users = await UserModel.query().select(
        "id",
        "email",
        "username",
        "role"
      );
      return users;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves an existing user from the database by their username or email.
   * @param {string} username - The username of the user to retrieve.
   * @param {string} email - The email of the user to retrieve.
   * @returns {Promise<Object|null>} A promise that resolves with the user object if found, or null if not found.
   * @throws {Error} Throws an error if there is an issue while retrieving the user.
   */
  static async getExistingUser(username, email) {
    try {
      const user = await UserModel.query()
        .where("email", email)
        .orWhere("username", username)
        .select("id", "email", "username", "role")
        .first();
      return user;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserModel;
