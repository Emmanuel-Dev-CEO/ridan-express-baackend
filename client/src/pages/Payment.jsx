import React, { useState } from 'react';
import Headers from '../components/Headers';
import Footer from '../components/Footer';
import Paystack from '../components/Paystack'; // Import Paystack component
import { useLocation } from 'react-router-dom';

const Payment = () => {
    const { state: { price, items, orderId } } = useLocation();
    const [paymentMethod, setPaymentMethod] = useState('paystack'); // Default to Paystack
    const [customerEmail, setCustomerEmail] = useState(''); // State to store customer email

    const handleEmailChange = (e) => {
        setCustomerEmail(e.target.value);
    };

    return (
        <div>
            <Headers />
            <section className='bg-[#eeeeee]'>
                <div className='w-[85%] lg:w-[90%] md:w-[90%] sm:w-[90%] mx-auto py-16 mt-4'>
                    <div className='flex flex-wrap md:flex-col-reverse'>
                        <div className='w-7/12 md:w-full'>
                            <div className='pr-2 md:pr-0'>
                                <div className='flex flex-wrap'>
                                    {/* Paystack Payment Method */}
                                    <div 
                                        onClick={() => setPaymentMethod('paystack')} 
                                        className={`w-[20%] border-r cursor-pointer py-8 px-12 ${paymentMethod === 'paystack' ? 'bg-white' : 'bg-slate-100'}`}>
                                        <div className='flex flex-col gap-[3px] justify-center items-center'>
                                            <img src="http://localhost:3000/images/payment/paystack.png" alt="Paystack payment" />
                                            <span className='text-slate-600'>Paystack</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method Components */}
                                {paymentMethod === 'paystack' && (
                                    <div className='w-full px-4 py-8 bg-white shadow-sm'>
                                        <div className='mb-4'>
                                            <label className='block text-gray-700 text-sm font-bold mb-2'>Email Address</label>
                                            <input
                                                type='email'
                                                value={customerEmail}
                                                onChange={handleEmailChange}
                                                placeholder='Enter your email'
                                                className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500'
                                            />
                                        </div>
                                        <Paystack
                                            orderId={orderId}
                                            price={price}
                                            customerEmail={customerEmail} // Pass customer email
                                        />
                                    </div>
                                )}
                                {paymentMethod === 'bkash' && (
                                    <div className='w-full px-4 py-8 bg-white shadow-sm'>
                                        <button className='px-10 py-[6px] rounded-sm hover:shadow-orange-500/20 hover:shadow-lg bg-orange-500 text-white'>
                                            Pay Now
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className='w-5/12 md:w-full'>
                            <div className='pl-2 md:pl-0 md:mb-0'>
                                <div className='bg-white shadow p-5 text-slate-600 flex flex-col gap-3'>
                                    <h2>Order Summary</h2>
                                    <div className='flex justify-between items-center'>
                                        <span>{items} items and shipping fee included</span>
                                        <span>${price}</span>
                                    </div>
                                    <div className='flex justify-between items-center font-semibold'>
                                        <span>Total Amount</span>
                                        <span className='text-lg text-orange-500'>${price}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Payment;
