const { Model } = require("objection");
const UserModel = require("./userModel");
/**
 * Represents the Order model.
 */
class OrderModel extends Model {

   /**
   * Returns the table name for the Orders model.
   * @returns {string} The table name.
   */
  static get tableName() {
    return `orders`;
  }

  /**
   * Returns the JSON schema for the Orders model.
   * @returns {Object} The JSON schema.
   */
  static get jsonSchema() {
    return {
      type: "object",
      required: ["sandwichId", "status", "customer"],

      properties: {
        id: { type: "integer" },
        customer: { type: "string", minLength: 1, maxLength: 255 },
        sandwichId: { type: "integer" },
        status: { type: "string", minLength: 1, maxLength: 255 },
      },
    };
  }

  /**
 * Represents the relation mappings for the Order model and its associated user.
 * @returns {Object} The relation mappings.
 */
  static get relationMappings() {
    return {
      customerName: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: 'orders.customer',
          to: 'users.username'
        }
      }
    }
  }
}

module.exports = OrderModel;
