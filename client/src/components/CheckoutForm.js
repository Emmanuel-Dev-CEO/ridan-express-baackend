import React, { useState } from 'react';

const CheckoutForm = ({ orderId }) => {
    localStorage.setItem('orderId', orderId);
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handlePayment = (event) => {
        event.preventDefault();
        setIsLoading(true);

        const handler = window.PaystackPop.setup({
            key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
            email: 'customer@example.com',
            amount: 5000 * 100,
            currency: 'NGN',
            ref: orderId,
            callback: async (response) => {

                const reference = response.reference;
                console.log('Payment successful. Reference:', reference);

                const verificationResult = await verifyPaystackPayment(reference);
                if (verificationResult) {
                    setMessage('Payment verified successfully. Thank you for your order!');
                } else {
                    setMessage('Payment verification failed. Please try again.');
                }
                setIsLoading(false);
            },
            onClose: () => {
                // Handle when the user closes the payment modal
                setMessage('Payment was closed. Please try again.');
                setIsLoading(false);
            },
        });

        handler.openIframe(); // Open the Paystack payment modal
    };

    return (
        <form onSubmit={handlePayment} id='payment-form'>
            <button disabled={isLoading} id='submit' className='px-10 py-[6px] rounded-sm hover:shadow-orange-500/20 hover:shadow-lg bg-orange-500 text-white'>
                <span id='button-text'>
                    {
                        isLoading ? <div>Loading...</div> : "Pay now"
                    }
                </span>
            </button>
            {message && <div>{message}</div>}
        </form>
    );
}

export default CheckoutForm;
