# Server B

Server B is set up using a ready-made Docker Hub Node.js image so no Dockerfile is needed.
Server B is connected to the RabbitMQ message broker using npm library `amqlib`.
Server B listens to the queue and after 5 seconds, returns the ready order back to server A and takes the next order from the queue.
