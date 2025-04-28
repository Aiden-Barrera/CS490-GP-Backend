// This file is responsible for acting as the producer (sender) of messages, in the case of the Primewell_Clinic system, the producer of messages will  be a 'doctor' sending a prescription (the blob/data) to the pharmacies, in other words, the front-end server is the producer

// Importing the node stream client for RabbitMQ
import { json } from "express";
import amqp from "amqplib/callback_api.js";

// Connect to RabbitMQ and create a channel
amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
          throw error1;
        }
        var queue = 'hello';
        var msg = {"Patient_ID":1, "Doctor_ID":1, "Pill_ID":1, "Quantity":2};
        // Declare a queue
        channel.assertQueue(queue, {
          durable: false
        });
        // Send message to the queue
        // Doctors will send messages to this queue via the frontend, and the queued prescriptions will be received by the pharmacies. Many 1-1 queues can be used or queueing types can be configured to give to different pharmacies.
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
        console.log(" [x] Sent %s", msg);
    });

    setTimeout(function() {
        connection.close();
        process.exit(0)
      }, 500
    );
});

