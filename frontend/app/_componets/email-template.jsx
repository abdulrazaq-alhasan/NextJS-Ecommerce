import * as React from 'react';

export function EmailTemplate({ firstName, amount }) {
    return (
        <div>
            <h1>Welcome, {firstName}!</h1>
            {amount != null && (
                <p>Your payment of ${amount} was received successfully.</p>
            )}
            <p>Thanks for shopping with us.</p>
        </div>
    );
}