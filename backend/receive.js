// This file is responsible for acting as the consumer, which continuously runs, waiting for messages to be pushed to it. The producer/publisher sends messages one at a time to the queue, but the consumer will receive messages in a stream. 
// In the primewell_clinic system. The consumer will be a pharmacy, which will receive the prescription from the doctor.
// The consumer, will connect to a RabbitMQ node and wait for messages to be pushed to it

import amqp from "amqplib/callback_api.js";

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    // Open a connection and create a channel to consume messages from
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'hello';

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
        //The queue will push us messages asynchronously, so, we provide a callback that will be executed when RabbitMQ pushes messages to our consumer. This is what Channel.consume does
        channel.consume(queue, function(msg) {
            console.log(" [x] Received Prescription %s", msg.content.toString());
        }, {
            noAck: true
        });
    });
});