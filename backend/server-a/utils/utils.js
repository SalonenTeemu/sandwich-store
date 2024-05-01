//Utils file which contains database testdata and some constants.

/**
 * Represents the status values for orders.
 * @enum {string}
 */
const status = {
  ORDERED: "ordered",
  RECEIVED: "received",
  IN_QUEUE: "inQueue",
  READY: "ready",
  FAILED: "failed",
};

/**
 * Represents a list of status values for orders.
 * @type {Array<string>}
 */
const statusList = ["ordered", "received", "inQueue", "ready", "failed"];

/**
 * Represents a list of bread types values for sandwiches.
 * @type {Array<string>}
 */
const breadTypeList = ["oat", "rye", "wheat", "sourdough", "corn"];

/**
 * Represents a list of role values for users.
 * @type {Array<string>}
 */
const roleList = ["customer", "admin"];

/**
 * Represents a list of topping values for sandwiches and to be added to database.
 * @type {Array<Object>}
 */
const toppings = [
  { id: 1, name: "Lettuce" },
  { id: 2, name: "Tomato" },
  { id: 3, name: "Cheese" },
  { id: 4, name: "Onion" },
  { id: 5, name: "Pickles" },
  { id: 6, name: "Mayonnaise" },
  { id: 7, name: "Mustard" },
  { id: 8, name: "Ketchup" },
  { id: 9, name: "Ham" },
  { id: 10, name: "Chicken" },
];

/**
 * Represents a data list of test users to be added to database.
 * @type {Array<Object>}
 */
const users = [
  {
    email: "admin@email.com",
    role: "admin",
    username: "admin",
    password_hash:
      "$2a$10$oZKAZX8N4y8KRZIAv9z0tupyEwHvsg2MvNjzhoZit/h4eTNShosvi", //admin
  },
  {
    email: "customer@email.com",
    role: "customer",
    username: "customer",
    password_hash:
      "$2a$10$1UsG0RiZK0MN3dQ9bvVveeIMDwSYsLLGrGIjxlZfQh8saq1zmFtBC", //customer
  },
];

/**
 * Represents a data list of test sandwiches to be added to database.
 * @type {Array<Object>}
 */
const sandwiches = [
  {
    name: "Sandwich1",
    breadType: "wheat",
  },
  {
    name: "Sandwich2",
    breadType: "sourdough",
  },
  {
    name: "Sandwich3",
    breadType: "rye",
  },
  {
    name: "Sandwich4",
    breadType: "oat",
  },
  {
    name: "Sandwich5",
    breadType: "wheat",
  },
];

/**
 * Represents a data list of test sandwich/topping relations to be added to database.
 * @type {Array<Object>}
 */
const sandwichToppings = [
  {
    sandwich_id: 1,
    topping_id: 2,
  },
  {
    sandwich_id: 1,
    topping_id: 3,
  },
  {
    sandwich_id: 2,
    topping_id: 1,
  },
  {
    sandwich_id: 2,
    topping_id: 4,
  },
  {
    sandwich_id: 2,
    topping_id: 5,
  },
  {
    sandwich_id: 3,
    topping_id: 1,
  },
  {
    sandwich_id: 3,
    topping_id: 6,
  },
  {
    sandwich_id: 4,
    topping_id: 3,
  },
  {
    sandwich_id: 4,
    topping_id: 9,
  },
  {
    sandwich_id: 5,
    topping_id: 10,
  },
];

/**
 * Represents a data list of test orders to be added to database.
 * @type {Array<Object>}
 */
const orders = [
  {
    customer: "customer",
    sandwichId: 1,
    status: status.READY
  },
  {
    customer: "customer",
    sandwichId: 2,
    status: status.FAILED
  },
  {
    customer: "customer",
    sandwichId: 3,
    status: status.READY
  },
  {
    customer: "admin",
    sandwichId: 4,
    status: status.READY
  },
  {
    customer: "admin",
    sandwichId: 5,
    status: status.FAILED
  },
];

module.exports = {
  status,
  statusList,
  breadTypeList,
  roleList,
  toppings,
  users,
  sandwiches,
  sandwichToppings,
  orders
};
