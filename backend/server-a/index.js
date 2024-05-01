"use strict";

const userRoutes = require("./routes/userRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const sandwichRoutes = require("./routes/sandwichRoutes.js");
const swaggerUi = require("swagger-ui-express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { start } = require("./rabbit-utils/utils.js");
const { getCurrentUser } = require("./auth/auth.js");

const express = require("express");
const connectDB = require("./db/db.js");

const db = connectDB();
const app = express();

const env = process.env;
const cookieSecret = env.COOKIE_SECRET;
const specs = require("./swagger/swagger.json");

app.use(bodyParser.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Options for cookies, setting age for 1 hour and using http only.
const cookieOptions = {
  httpOnly: true,
  maxAge: 3600000,
  path: "/",
  sameSite: "strict",
  secure: false,
};

app.set("cookieOptions", cookieOptions);
app.set("cookieSecret", cookieSecret);
app.use(cookieParser(cookieSecret, cookieOptions));

// Middleware for identifying the requesting user or user that is not signed in by validating the cookie.
app.use(getCurrentUser);

// Setup api routes and Swagger docs route.
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/user", userRoutes);
app.use("/order", orderRoutes);
app.use("/sandwich", sandwichRoutes);

app.listen(3000, () => {
  console.log(`Server A running on port 3000`);
});

// Start listening for messages from Server B and setup message sending.
start();
