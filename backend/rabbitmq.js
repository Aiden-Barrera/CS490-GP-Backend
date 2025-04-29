// rabbitmq.js
import amqp from 'amqplib';
import { createPerscription, createPayment, getPrescriptionWithNamesById } from './PrimeWell_db.js';

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
    channel.consume(q.queue, async (msg) => {
        if (msg !== null) {
            const prescription = JSON.parse(msg.content.toString());

            try {
                const prescription_id = await createPerscription(
                    prescription.Patient_ID,
                    prescription.Pill_ID, 
                    prescription.Quantity,
                    prescription.Doctor_ID,
                    prescription.Pharm_ID,
                    "Pending"
                )
                console.log("Creating a new prescription from rabbitMQ")

                await createPayment(prescription.Patient_ID, prescription_id, "Prescription", "Pending")
                console.log("Payment Created")

                const enriched = await getPrescriptionWithNamesById(prescription_id);
                onMessage(enriched);
                channel.ack(msg);
            } catch (err) {
                console.log("Error Inserting new prescription: ", err)
            }
        }
    });
}

export { sendPrescription, consumePrescriptions };
