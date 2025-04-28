// THIS IMPLMEMENTATION OF RABBITMQ UTILIZES AN EXCHANGE OF TYPE DIRECT, WHICH MATCHES CONSUMES MESSAGES FROM THE QUEUE BASED ON THE ROUTING KEY 

import amqp from "amqplib/callback_api.js";

var args = process.argv.slice(2);

// Check if the user has provided at least one severity level (routing key) in the command line
if (args.length == 0) {
    console.log("Usage: receive_logs_direct.js [info] [warning] [error]");
    process.exit(1);
}

// Connect to the RabbitMQ server
amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }

    // Create a channel
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        // Define the exchange name
        var exchange = 'direct_logs';

        // Declare a direct exchange
        channel.assertExchange(exchange, 'direct', {
            durable: false
        });

        // Create a queue and
        channel.assertQueue('', {
            exclusive: true
        }, function(error2, q) {
            if (error2) {
                throw error2;
            }
            console.log(' [*] Waiting for logs. To exit press CTRL+C');

            // Bind the queue to the exchange with the specified severity levels (routing keys)
            args.forEach(function(severity) {
                channel.bindQueue(q.queue, exchange, severity);
            });

            // Consume messages from the queue and log them to the console
            channel.consume(q.queue, function(msg) {
                console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
            }, {
                noAck: true
            });
        });
    });
});