import { NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    typescript: true,
    apiVersion: "2023-08-16",
});
export async function POST(request: any) {
    const data: any = await request.json();
    const amount = data.amount;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Number(amount) * 100,
            currency: "usd",
            automatic_payment_methods: { enabled: true },
        });
        return NextResponse.json(paymentIntent.client_secret, { status: 200 });
    } catch (error: any) {
        const message = typeof error?.message === 'string' ? error.message : 'Failed to create payment intent';
        return NextResponse.json({ error: message }, { status: 400 });
    }
}