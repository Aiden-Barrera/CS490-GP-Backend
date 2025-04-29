// rabbitmq.js
import amqp from 'amqplib';

const RABBITMQ_URL = 'amqp://localhost';
const EXCHANGE_NAME = 'prescriptions_exchange';

async function sendPrescription(pharmacyName, prescriptionData) {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });

    const messageBuffer = Buffer.from(JSON.stringify(prescriptionData));
    await channel.publish(EXCHANGE_NAME, pharmacyName, messageBuffer);
    console.log(" [x] Sent %s: '%s'", pharmacyName, prescriptionData);

    await channel.close();
    await connection.close();
}

async function consumePrescriptions(pharmacyName, onMessage) {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, 'direct', { durable: true });

    const q = await channel.assertQueue('', { exclusive: true }); // random queue name
    await channel.bindQueue(q.queue, EXCHANGE_NAME, pharmacyName); // bind the queue to the exchange with the pharmacy name as the routing key -> problem?

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
    channel.consume(q.queue, (msg) => {
        if (msg !== null) {
            const prescription = JSON.parse(msg.content.toString());
            onMessage(prescription);
            channel.ack(msg);
        }
    });
}

export { sendPrescription, consumePrescriptions };
