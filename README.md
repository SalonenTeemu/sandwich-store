# sandwich-store

Sandwich store app for ordering sandwiches.

### System architecture

The system composes of two backend servers, a database, the frontend, and a message broker.
Both backend servers, frontend, message broker and database are containerized with Docker.
Backend has its own Docker network which is shared by backend servers A and B, the database, and the message broker.
Servers A and B communicate between each other via the message broker.

### Used technologies

Backend services are implemented using Node.js. PostgreSQL is used as the database option.
React is used as the frontend framework. Redux is used to manage the application state. CSS framework Tailwind CSS is used to style the frontend.
RabbitMQ is used as the message broker.
Application is containerized using Docker.

### How to run

The system can be started by running the command `docker-compose up` or
`docker-compose up --build` in the project root directory. This will start up the
services and when they are running, the application UI can be accessed on a
browser from `http://localhost:5173`. The API Swagger documentation can be
found from `http://localhost:3000/api-docs`

### How to test the application

The application has three roles for the user. If the user has not logged in to the
application, they have a role of `guest`. Authenticated user can have a role of `customer` or `admin`.
When you register to the application, you are given the role of `customer`.
One of the initial test users has a role of `customer` and one has a role of `admin`.

Full details of the users, which can be used to test the application:

Admin user:

- username: admin
- password: admin

Customer user:

- username: customer
- password: customer
