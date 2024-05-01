const { Model } = require("objection");

/**
 * Represents the Toppings model.
 */
class ToppingsModel extends Model {

  /**
   * Returns the table name for the Toppings model.
   * @returns {string} The table name.
   */
  static get tableName() {
    return `toppings`;
  }

  /**
   * Returns the JSON schema for the Toppings model.
   * @returns {Object} The JSON schema.
   */
  static get jsonSchema() {
    return {
      type: "object",
      required: ["name"],
      properties: {
        id: { type: "integer" },
        name: { type: "string", minLength: 1, maxLength: 255 },
      },
    };
  }
}

module.exports = ToppingsModel;
