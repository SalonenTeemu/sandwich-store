const { Model } = require("objection");
const SandwichModel = require("./sandwichModel");
const ToppingsModel = require("./toppingsModel");

/**
 * Represents the SandwichToppings model referencing sandwich and toppings tables.
 */
class SandwichesToppingsModel extends Model {

  /**
   * Returns the table name for the SandwichToppings model.
   * @returns {string} The table name.
   */
  static get tableName() {
    return `sandwiches_toppings`;
  }

  /**
   * Returns the primary key column(s) for the SandwichToppings model.
   * @returns {string[]} The primary key column(s).
   */
  static get idColumn() {
    return ["sandwich_id", "topping_id"];
  }

  /**
   * Returns the JSON schema for the SandwichToppings model.
   * @returns {Object} The JSON schema.
   */
  static get jsonSchema() {
    return {
      type: "object",
      required: ["sandwich_id", "topping_id"],
      properties: {
        sandwich_id: { type: "integer" },
        topping_id: { type: "integer" },
      },
    };
  }

/**
 * Represents the relation mappings for the Sandwich and Topping models.
 * @returns {Object} The relation mappings.
 */
  static relationMappings() {
    return {
      sandwich: {
        relation: Model.ManyToManyRelation,
        modelClass: SandwichModel,
        join: {
          from: "sandwiches_toppings.sandwich_id",
          through: {
            from: "sandwiches_toppings.sandwich_id",
            to: "sandwiches_toppings.topping_id",
          },
          to: "sandwiches.id",
        },
      },
      topping: {
        relation: Model.ManyToManyRelation,
        modelClass: ToppingsModel,
        join: {
          from: "sandwiches_toppings.topping_id",
          through: {
            from: "sandwiches_toppings.topping_id",
            to: "sandwiches_toppings.sandwich_id",
          },
          to: "toppings.id",
        },
      },
    };
  }

  /**
 * Patches the toppings for a sandwich.
 * @param {number} sandwichId - The ID of the sandwich.
 * @param {Array<number>} updatedToppings - The IDs of the updated toppings.
 * @returns {Promise<Array<number>>} The IDs of the updated toppings.
 */
  static async patchSandwichToppings(sandwichId, updatedToppings) {
    try {
      return await SandwichesToppingsModel.transaction(async (trx) => {
        await SandwichesToppingsModel.query(trx)
          .delete()
          .where("sandwich_id", sandwichId);

        const toppingInserts = updatedToppings.map((toppingId) => ({
          sandwich_id: sandwichId,
          topping_id: toppingId,
        }));
        await SandwichesToppingsModel.query(trx).insert(toppingInserts);
        return updatedToppings;
      });
    } catch (error) {
      console.error("Error patching sandwich toppings:", error.message);
      throw error;
    }
  }
}

module.exports = SandwichesToppingsModel;
