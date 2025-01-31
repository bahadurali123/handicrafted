import { Configuration } from "../../config/env.config.js";
import Stripe from 'stripe';
import Order from "../../models/order.model.js";
const stripe = new Stripe(Configuration.stripesecretkey);

const stripeWebhook = async (request, response) => {
    console.log("Stripe Webhook!");

    let event = request.body;
    console.log("1", event);
    const orderdata = {
        id: event.id,
        amount: event.data?.object?.amount,
        currency: event.data?.object?.currency,
        status: event.data?.object?.status,
        payMethodDetails: event.data?.object?.payment_method_details?.type,
        payMethodTypes: event.data?.object?.payment_method_types,
    }
    console.log("2", orderdata);
    //   const endpointSecret = process.env.WEBHOOK_SECRET;
    const endpointSecret = Configuration.stripewebhooksecretkey;
    // console.log(`1.1: Thats a Webhook Request! id is: ${event.id} and Object is: ${event.data.object.object}`);
    // Only verify the event if you have an endpoint secret defined.
    if (endpointSecret) {
        // console.log('2: Signatures in Webhook Request!');
        try {
            // console.log('2.1: in try!', event.id);
            const payload = {
                id: event.id,
                object: event.data.object.object,
            };
            const payloadString = JSON.stringify(payload, null, 2);
            // console.log('3!', payloadString);
            const secret = endpointSecret;
            const header = stripe.webhooks.generateTestHeaderString({
                payload: payloadString,
                secret,
            });
            // console.log('4!', header);
            // Get the signature sent by Stripe
            const constructeventis = stripe.webhooks.constructEvent(payloadString, header, secret);
            console.log('Event is this ', constructeventis);
            // Do something with mocked signed event
            // expect(constructeventis.id).to.equal(payload.id);
        } catch (err) {
            console.log(`⚠️  Webhook signature verification failed.`, err.message);
            return response.sendStatus(400);
        }
    }

    // Update Order
    const OrderData = await Order.findOneAndUpdate(
        { gatewayOrderId: event.data.object.id },
        {
            gatewayOrderId: event.id,
            paymentStatus: event.data?.object?.status,
        },
        { new: true }
    );
    console.log("order Data: ", OrderData);

    // Handle necessary events
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            if (session.payment_status === 'paid') {
                console.log(`Checkout Session ${session.id} completed successfully.`);
                // Fulfill the order or update database
            } else {
                console.warn(`Checkout Session ${session.id} payment status: ${session.payment_status}`);
            }
            break;

        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log(`PaymentIntent ${paymentIntent.id} for ${paymentIntent.amount / 100} succeeded.`);
            // Optionally handle additional payment completion logic
            break;

        case 'payment_intent.payment_failed':
            const failedPaymentIntent = event.data.object;
            console.error(`PaymentIntent ${failedPaymentIntent.id} failed.`);
            // Handle failed payment
            break;

        case 'charge.succeeded':
            const charge = event.data.object;
            console.log(`Charge ${charge.id} for ${charge.amount / 100} succeeded.`);
            // Optional: Handle charge-specific logic
            break;

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }


    // // ...........
    // // Handle the event type
    // switch (event.type) {
    //     // **Payment Intent Events**
    //     case 'payment_intent.succeeded':
    //         const paymentIntent = event.data.object;
    //         console.log(`PaymentIntent for ${paymentIntent.amount / 100} was successful.`);
    //         // Update database or fulfill the order
    //         break;

    //     case 'payment_intent.payment_failed':
    //         const failedPaymentIntent = event.data.object;
    //         console.error(`PaymentIntent failed for ${failedPaymentIntent.amount / 100}.`);
    //         break;

    //     case 'payment_intent.created':
    //         const createdPaymentIntent = event.data.object;
    //         console.log(`PaymentIntent for ${createdPaymentIntent.amount / 100} was created.`);
    //         break;

    //     // **Charge Events**
    //     case 'charge.succeeded':
    //         const charge = event.data.object;
    //         console.log(`Charge ${charge.id} for ${charge.amount / 100} succeeded.`);
    //         break;

    //     case 'charge.failed':
    //         const failedCharge = event.data.object;
    //         console.error(`Charge ${failedCharge.id} failed.`);
    //         break;

    //     case 'charge.refunded':
    //         const refundedCharge = event.data.object;
    //         console.log(`Charge ${refundedCharge.id} was refunded.`);
    //         break;

    //     // **Checkout Session Events**
    //     case 'checkout.session.completed':
    //         const session = event.data.object;
    //         console.log(`Checkout Session ${session.id} completed.`);
    //         // Fulfill the order or update the database
    //         if (session.payment_status === 'paid') {
    //             console.log(`Session for customer ${session.customer} is fully paid.`);
    //         } else {
    //             console.log(`Session payment status: ${session.payment_status}`);
    //         }
    //         break;

    //     case 'checkout.session.expired':
    //         const expiredSession = event.data.object;
    //         console.warn(`Checkout Session ${expiredSession.id} expired.`);
    //         break;

    //     // **Payment Method Events**
    //     case 'payment_method.attached':
    //         const paymentMethod = event.data.object;
    //         console.log(`Payment Method attached: ${paymentMethod.id}`);
    //         break;

    //     // **Customer Events**
    //     case 'customer.created':
    //         const customer = event.data.object;
    //         console.log(`Customer created: ${customer.id}`);
    //         break;

    //     case 'customer.updated':
    //         const updatedCustomer = event.data.object;
    //         console.log(`Customer updated: ${updatedCustomer.id}`);
    //         break;

    //     case 'customer.deleted':
    //         const deletedCustomer = event.data.object;
    //         console.log(`Customer deleted: ${deletedCustomer.id}`);
    //         break;

    //     // **Subscription Events**
    //     case 'invoice.payment_succeeded':
    //         const invoice = event.data.object;
    //         console.log(`Invoice ${invoice.id} payment succeeded.`);
    //         break;

    //     case 'invoice.payment_failed':
    //         const failedInvoice = event.data.object;
    //         console.error(`Invoice ${failedInvoice.id} payment failed.`);
    //         break;

    //     case 'customer.subscription.created':
    //         const subscription = event.data.object;
    //         console.log(`Subscription ${subscription.id} created.`);
    //         break;

    //     case 'customer.subscription.updated':
    //         const updatedSubscription = event.data.object;
    //         console.log(`Subscription ${updatedSubscription.id} updated.`);
    //         break;

    //     case 'customer.subscription.deleted':
    //         const deletedSubscription = event.data.object;
    //         console.log(`Subscription ${deletedSubscription.id} deleted.`);
    //         break;

    //     // **Dispute Events**
    //     case 'charge.dispute.created':
    //         const dispute = event.data.object;
    //         console.log(`Dispute created for charge ${dispute.charge}.`);
    //         break;

    //     case 'charge.dispute.closed':
    //         const closedDispute = event.data.object;
    //         console.log(`Dispute for charge ${closedDispute.charge} closed.`);
    //         break;

    //     // **Refund Events**
    //     case 'refund.succeeded':
    //         const refund = event.data.object;
    //         console.log(`Refund ${refund.id} succeeded.`);
    //         break;

    //     default:
    //         console.warn(`Unhandled event type ${event.type}.`);
    // }

    response.send();
}

export default stripeWebhook;