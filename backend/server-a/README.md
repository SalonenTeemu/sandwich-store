# Server A

Server A is set up using a ready-made Docker Hub Node.js image so no Dockerfile is needed.
The server A uses the Express framework.
Server A is connected to the RabbitMQ message broker using npm library `amqlib`.
Documentation of the API endpoints are defined using Swagger OpenAPI 3.0 with the help of npm library `swagger-ui-express`.
The server A uses PostgreSQL as the database option alongside npm libraries `knex` and `objection`.
Server A sends the orders to server B and writes the database when the order is in the queue and when it comes back as ready.
JSON Web Tokens are used for authentication and are set as cookies in requests. Bcrypt is used to hash user passwords.
Npm libraries `jsonwebtoken`, `cookie-parser` and `bcryptjs` are used to achieve this.
