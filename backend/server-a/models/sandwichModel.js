const { Model } = require("objection");
const SandwichesToppingsModel = require("./sandwichesToppingsModel.js");
const ToppingsModel = require("./toppingsModel.js");

/**
 * Represents the Sandwich model.
 */
class SandwichModel extends Model {
  /**
   * Returns the table name for the Sandwich model.
   * @returns {string} The table name.
   */
  static get tableName() {
    return `sandwiches`;
  }

  /**
   * Returns the JSON schema for the Sandwich model.
   * @returns {Object} The JSON schema.
   */
  static get jsonSchema() {
    return {
      type: "object",
      required: ["name", "breadType"],
      properties: {
        id: { type: "integer" },
        name: { type: "string", minLength: 1, maxLength: 255 },
        breadType: { type: "string", minLength: 1, maxLength: 255 },
      },
    };
  }

  /**
   * Represents the relation mappings for the Sandwich model and its associated Toppings.
   * @returns {Object} The relation mappings.
   */
  static get relationMappings() {
    return {
      toppings: {
        relation: Model.ManyToManyRelation,
        modelClass: ToppingsModel,
        join: {
          from: "sandwiches.id",
          through: {
            from: "sandwiches_toppings.sandwich_id",
            to: "sandwiches_toppings.topping_id",
          },
          to: "toppings.id",
        },
      },
    };
  }

  /**
   * Creates a sandwich with associated toppings.
   * @param {Object} sandwichData - The data for the sandwich including name, breadType, and toppings.
   * @returns {Promise<Object>} A promise that resolves to the created sandwich object.
   * @throws {Error} If an error occurs during the creation process.
   */
  static async createWithToppings(sandwichData) {
    const { name, breadType, toppings } = sandwichData;
    try {
      return await this.transaction(async (trx) => {
        try {
          const sandwich = await this.query(trx).insert({
            name: name,
            breadType: breadType,
          });
          if (toppings && toppings.length > 0) {
            const toppingInserts = toppings.map((toppingId) => ({
              sandwich_id: sandwich.id,
              topping_id: toppingId,
            }));
            await SandwichesToppingsModel.query(trx).insert(toppingInserts);
          }
          return sandwich;
        } catch (error) {
          await trx.rollback();
          throw error;
        }
      });
    } catch (error) {
      throw new Error(
        `Error creating sandwich with toppings: ${error.message}`
      );
    }
  }
}

module.exports = SandwichModel;
