module.exports = config = {
  client: "pg",
  connection: {
    password: "pass",
    host: "database",
    database: "db",
    port: 5432,
    user: "user",
    charset: "utf8",
  },
  pool: {
    min: 2,
    max: 10,
  },
};
