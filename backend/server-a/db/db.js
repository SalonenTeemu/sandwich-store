const knex = require("knex");
const config = require("./knexfile.js");
const { Model } = require("objection");
const {
  toppings,
  breadTypeList,
  statusList,
  roleList,
  users,
  sandwiches,
  sandwichToppings,
  orders,
} = require("../utils/utils.js");

module.exports = async () => {
  try {
    const connection = knex(config);
    Model.knex(connection);
    // Sanity check
    await connection.raw("SELECT 1");
    console.log("Connected to the database");

    await initDbTables(connection);
    return connection;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
};

/**
 * Initializes the database creating tables and inserting values if they don't already exist.
 */
async function initDbTables(connection) {
  console.log("Checking tables and extensions...");

  //Uuid extension for user id
  await connection.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  //Check and create users table and insert if not exists.
  const hasUsersTable = await connection.schema.hasTable("users");
  if (!hasUsersTable) {
    await connection.schema
      .createTable("users", function (table) {
        table
          .uuid("id")
          .primary()
          .defaultTo(connection.raw("uuid_generate_v4()"));
        table.enum("role", roleList).defaultTo("customer");
        table.string("email").unique();
        table.string("username").unique();
        table.string("password_hash");
      })
      .then(async () => {
        await connection("users").insert(users);
      });
    console.log("Created 'users' table");
  }

  //Check and create sandwiches table and insert if not exists.
  const hasSandwichesTable = await connection.schema.hasTable("sandwiches");
  if (!hasSandwichesTable) {
    await connection.schema
      .createTable("sandwiches", function (table) {
        table.increments("id").primary();
        table.string("name").unique();
        table.enum("breadType", breadTypeList);
      })
      .then(async () => {
        await connection("sandwiches").insert(sandwiches);
      });
    console.log("Created 'sandwiches' table");
  }

  //Check and create toppings table and insert toppings if not exists.
  const hasToppingsTable = await connection.schema.hasTable("toppings");
  if (!hasToppingsTable) {
    await connection.schema
      .createTable("toppings", function (table) {
        table.integer("id").primary();
        table.string("name").unique();
      })
      .then(async () => {
        await connection("toppings").insert(toppings);
      });

    console.log("Created 'toppings' table");
  }

  //Check and create sandwich_toppings relation table and insert if not exists.
  const hasSandwichToppingsTable = await connection.schema.hasTable(
    "sandwiches_toppings"
  );
  if (!hasSandwichToppingsTable) {
    await connection.schema
      .createTable("sandwiches_toppings", function (table) {
        table.increments("id").primary();
        table
          .integer("sandwich_id")
          .unsigned()
          .references("id")
          .inTable("sandwiches")
          .onDelete("CASCADE");
        table
          .integer("topping_id")
          .unsigned()
          .references("id")
          .inTable("toppings")
          .onDelete("CASCADE");
        table.unique(["sandwich_id", "topping_id"]);
      })
      .then(async () => {
        await connection("sandwiches_toppings").insert(sandwichToppings);
      });
    console.log("Created 'sandwiches_toppings' relation table");
  }

  //Check and create orders table and insert if not exists.
  const hasOrdersTable = await connection.schema.hasTable("orders");
  if (!hasOrdersTable) {
    await connection.schema
      .createTable("orders", function (table) {
        table.increments("id").primary();
        table
          .string("customer")
          .references("username")
          .inTable("users")
          .onDelete("CASCADE");
        table
          .integer("sandwichId")
          .references("id")
          .inTable("sandwiches")
          .onDelete("CASCADE");
        table.enum("status", statusList);
      })
      .then(async () => {
        await connection("orders").insert(orders);
      });
    console.log("Created 'orders' table");
  }
  console.log("Check complete");
}
