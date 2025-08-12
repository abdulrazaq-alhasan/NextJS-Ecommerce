import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useContext, useState } from 'react';
import { CartContext } from '../../_context/CartContext';
import { useUser } from '@clerk/nextjs';
import api from '@/app/_utils/api';
const CheckoutForm = ({ amount }) => {
    const { cart, setCart } = useContext(CartContext)
    const { user } = useUser()
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [errormessage, setErrorMessage] = useState()
    const handleSubmit = async (event) => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }
        const handleError = (error) => {
            setLoading(false)
            setErrorMessage(error.message)
        }
        // Trigger form validation and wallet collection
        const { error: submitError } = await elements.submit();
        if (submitError) {
            handleError(submitError);
            return;
        }
        const res = await fetch('/api/create-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: amount
            })
        })
        const clientSecret = await res.json()

        const result = await stripe.confirmPayment({
            //`Elements` instance that was used to create the Payment Element
            clientSecret,
            elements,
            confirmParams: {
                return_url: "http://localhost:3000/checkout/payment-confirm",
            },
            redirect: 'if_required'
        });

        if (result.error) {
            // Show error to your customer (for example, payment details incomplete)
            console.log(result.error.message);
            handleError(result.error)
        } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
            // Payment succeeded without redirect (e.g., test card)
            await createOrder();
            await sendEmail();
            window.location.href = '/checkout/payment-confirm';
        }
    };
    const createOrder = async () => {
        let productIds = [];
        cart.forEach(el => {
            productIds.push(el?.product?.id)
        })
        const data = {
            data: {
                email: user.primaryEmailAddress.emailAddress,
                username: user.fullName,
                amount,
                products: productIds
            }
        }
        try {
            const res = await api.createOrder(data)
            if (res) {
                for (const el of cart) {
                    await api.deleteCartItem(el?.id)
                }
            }
        } catch (error) {
            setErrorMessage('Failed to create order. Please contact support if you were charged.');
        }
    }
    const sendEmail = async () => {
        const res = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: amount,
                email: user.primaryEmailAddress.emailAddress,
                fullName: user.fullName
            })
        })
        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            console.error('Send email failed:', body?.error || res.statusText);
        } else {
            const body = await res.json().catch(() => ({}));
            console.log('Email sent:', body);
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <div className='mx-32 md:mx-[320px] mt-12'><PaymentElement />
                <button className='w-full p-2 mt-4 text-white rounded-md bg-teal-700'>Submit</button>
            </div>

        </form>
    );
};

export default CheckoutForm;