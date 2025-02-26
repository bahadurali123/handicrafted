import { Configuration } from './env.config.js';
import Stripe from 'stripe';
const stripe = new Stripe(Configuration.stripesecretkey);

const Checkout = async (cart) => {
    console.log("Stripe config");
    const { totalprice } = cart;

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Handcrafted Product',
                    },
                    unit_amount: totalprice * 100, // $20.00
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        payment_intent_data: {
            capture_method: 'automatic', // Ensures payment is captured automatically
        },
        success_url: `${Configuration.FrontendUrl}/order/success`,
        cancel_url: `${Configuration.FrontendUrl}/order/cancel`,
    });

    return session;
};

export {
    Checkout
}