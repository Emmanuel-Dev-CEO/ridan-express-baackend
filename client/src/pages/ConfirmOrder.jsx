import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FadeLoader from 'react-spinners/FadeLoader';
import axios from 'axios';
import error from '../assets/error.png';
import success from '../assets/success.png';

const ConfirmOrder = () => {
    const [loader, setLoader] = useState(true);
    const [message, setMessage] = useState(null);
    
    useEffect(() => {
        const paymentReference = new URLSearchParams(window.location.search).get('reference');
        if (!paymentReference) {
            setMessage('failed');
            return;
        }
        verifyPayment(paymentReference);
    }, []);

    const verifyPayment = async (reference) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/order/verify-paystack-payment/${reference}`);
            if (response.data.status === 'success') {
                setMessage('succeeded');
            } else {
                setMessage('failed');
            }
        } catch (error) {
            console.log(error.response.data);
            setMessage('failed');
        }
    };

    const updatePayment = async () => {
        const orderId = localStorage.getItem('orderId');
        if (orderId) {
            try {
                await axios.get(`http://localhost:5000/api/order/confirm/${orderId}`);
                localStorage.removeItem('orderId');
                setLoader(false);
            } catch (error) {
                console.log(error.response.data);
            }
        }
    };

    useEffect(() => {
        if (message === 'succeeded') {
            updatePayment();
        }
    }, [message]);

    return (
        <div className='w-screen h-screen flex justify-center items-center flex-col gap-4'>
            {
                (message === 'failed') ? (
                    <>
                        <img src={error} alt="error logo" />
                        <Link className='px-5 py-2 bg-green-500 rounded-sm text-white' to='/dashboard/my-orders'>Back to Dashboard</Link>
                    </>
                ) : message === 'succeeded' ? (
                    loader ? <FadeLoader /> : (
                        <>
                            <img src={success} alt="success logo" />
                            <Link className='px-5 py-2 bg-green-500 rounded-sm text-white' to='/dashboard/my-orders'>Back to Dashboard</Link>
                        </>
                    )
                ) : <FadeLoader />
            }
        </div>
    );
}

export default ConfirmOrder;
