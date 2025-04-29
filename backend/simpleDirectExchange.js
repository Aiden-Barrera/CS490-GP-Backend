import amqp from "amqplib";

// RabbitMQ server URL
const RABBITMQ_URL = 'amqp://localhost';

// Exchange name
const EXCHANGE_NAME = 'sample_direct_exchange';

// Queue names
const queue1 = 'sample_direct_queue1';
const queue2 = 'sample_direct_queue2';

// Routing keys
const routingKey1 = 'sample_routing_key1';
const routingKey2 = 'sample_routing_key2';

async function sendMessage(exchange, routingKey, msg) {
    try {
        // Create a connection to RabbitMQ
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        // Declare a direct exchange
        await channel.assertExchange(exchange, 'direct', {
            durable: false
        });

        // Publish message to the exchange with the specified routing key
        await channel.publish(exchange, routingKey, Buffer.from(msg));
        await channel.close();
        await connection.close();
    }
    catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
}

async function receiveMessage(queueName, routingKey) {
    try {
        // Create a connection to RabbitMQ
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        // Declare a queue
        await channel.assertQueue(queueName);
        // Bind the queue to the exchange with the specified routing key
        await channel.bindQueue(queueName, EXCHANGE_NAME, routingKey);

        // Consume messages from the queue
        channel.consume(queueName, (msg) => {
            console.log(`Received message from ${queueName} with routing key ${routingKey}: ${msg.content.toString()}`);
            channel.ack(msg);
        });
        
    } catch (error) {
        console.error('Error receiving message:', error);
        throw error;
    }
}

// Send messages to the exchange with different routing keys
sendMessage(EXCHANGE_NAME, routingKey1, 'Hello from queue 1');
sendMessage(EXCHANGE_NAME, routingKey1, 'Hello again from queue 1');
sendMessage(EXCHANGE_NAME, routingKey1, 'Hello from queue 1 a third time');

sendMessage(EXCHANGE_NAME, routingKey2, 'Hello from queue 2');
sendMessage(EXCHANGE_NAME, routingKey2, 'Hello from queue 2 again');

// Receive messages from the queues
receiveMessage(queue1, routingKey1);
receiveMessage(queue2, routingKey2);