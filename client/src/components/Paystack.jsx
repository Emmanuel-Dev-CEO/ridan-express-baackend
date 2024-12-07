import React, { useState } from 'react';
import axios from 'axios';

const Paystack = ({ price, orderId }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const[customerEmail, setCustomerEmail] = useState('');

    const handlePayment = async () => {
        if(!customerEmail) {
            alert('Email is required!');    
            return;
        }
        setLoading(true);
        setError(''); // Reset error state

        
        try {
            // Make an API call to your backend to create a payment
            const { data } = await axios.post('http://localhost:5000/api/order/create-payment', { price: price, email: customerEmail }, { withCredentials: true });

            // Paystack's public key
            const paystackPublicKey = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY; 

            const paymentUrl = `https://js.paystack.co/v1/inline.js`;

            const script = document.createElement('script');
            script.src = paymentUrl;
            script.async = true;
            script.onload = () => {
                window.PaystackPop.setup({
                    key: paystackPublicKey,
                    email: customerEmail, 
                    amount: price * 100, 
                    currency: 'NGN', 
                    orderId: orderId, 
                    callback: function(response) {
                        console.log(response);
                    },
                    onClose: function() {
                        alert('Payment process was closed.');
                    },
                }).openIframe();
            };
            document.body.appendChild(script);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to initiate payment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='mt-4'>
            {error && <div className="text-red-600">{error}</div>}
            <input type="email" required onChange={(e)=> setCustomerEmail(e.target.value)} />
            <button
                onClick={handlePayment}
                disabled={loading}
                className='px-10 py-[6px] rounded-sm hover:shadow-orange-500/20 hover:shadow-lg bg-orange-500 text-white'
            >
                {loading ? 'Processing...' : 'Pay Now'}
            </button>
        </div>
    );
};

export default Paystack;
