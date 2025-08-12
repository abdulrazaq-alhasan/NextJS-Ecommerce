'use client'
import React from 'react'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import CheckoutForm from './_components/CheckoutForm'
import { useSearchParams } from 'next/navigation';
const initialKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_STRIPE_PUBLISHER_KEY;

function Checkout() {
    const searchParams = useSearchParams();
    const [pk, setPk] = useState(initialKey || "");
    const [stripePromise, setStripePromise] = useState(initialKey ? loadStripe(initialKey) : null);
    useEffect(() => {
        if (!initialKey) {
            fetch('/api/stripe-pk')
                .then((res) => res.json())
                .then((data) => {
                    if (data?.key) {
                        setPk(data.key);
                        setStripePromise(loadStripe(data.key));
                    }
                })
                .catch(() => { });
        }
    }, []);
    const amountParam = Number(searchParams.get('amount')) || 0;
    const options = {
        mode: 'payment',
        currency: 'usd',
        amount: Math.round(amountParam * 100),
    };
    if (!pk) {
        return (
            <div className='p-4 text-red-600'>
                Stripe publishable key is missing. Set `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (or legacy `NEXT_PUBLIC_STRIPE_PUBLISHER_KEY`) and restart the dev server.
            </div>
        )
    }
    return (
        <Elements stripe={stripePromise} options={options}>
            <CheckoutForm amount={Number(searchParams.get('amount'))} />
        </Elements>
    )
}

export default Checkout