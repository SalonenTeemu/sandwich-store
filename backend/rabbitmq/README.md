# RabbitMQ

The RabbitMQ message broker is set up using a ready-made Docker Hub image so no Dockerfile is needed.
Both servers A and B connect to  RabbitMQ using npm library `amqlib`.
In the docker-compose-file port 15672 is for the UI and 5672 for the broker itself.
Servers connect to the broker and create their own channels for consuming and producing messages.
