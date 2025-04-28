// THIS IMPLMEMENTATION OF RABBITMQ UTILIZES AN EXCHANGE OF TYPE DIRECT, WHICH MATCHES PUBLISHED MESSAGES TO THE QUEUE BASED ON THE ROUTING KEY 

import { json } from "express";
import amqp from "amqplib/callback_api.js";

// Connect to RabbitMQ
amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    // Establish a connection channel
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        // Define the exchange name, and retrieve the severity (routing key) and message (payload) from the command line arguments
        var exchange = 'direct_logs';
        var args = process.argv.slice(2);
        var msg = args.slice(1).join(' ') || 'Hello World!';
        var severity = (args.length > 0) ? args[0] : 'info';

        // Declare a direct exchange
        channel.assertExchange(exchange, 'direct', {
            durable: false
        });

        // Publish the message to the exchange with the specified severity (routing key)
        channel.publish(exchange, severity, Buffer.from(msg));
        console.log(" [x] Sent %s: '%s'", severity, msg);
    });

    setTimeout(function() {
        connection.close();
        process.exit(0);
    }, 500);
});