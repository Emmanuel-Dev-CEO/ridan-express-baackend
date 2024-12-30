import React, { useEffect, useState } from 'react';

const PaystackPayment = ({ customerEmail, price }) => {
  const [paystackLoaded, setPaystackLoaded] = useState(false);

  // Load Paystack script dynamically
  const loadPaystackScript = () => {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src="https://js.paystack.co/v2/inline.js"]')) {
        resolve();
      } else {
        const script = document.createElement('script');
        script.src = 'https://js.paystack.co/v2/inline.js';
        script.onload = resolve
        script.onerror = reject;
        document.body.appendChild(script);
      }
    });
  };

  // Initialize payment after Paystack script is loaded
  const initializePayment = async () => {
    try {
      if (!customerEmail) {
        alert('Please enter a valid email before proceeding.');
        return;
      }

      if (!price || isNaN(price)) {
        alert('Transaction amount is invalid. Please refresh and try again.');
        return;
      }

      await loadPaystackScript();
      if (!window.PaystackPop) {
        alert('Paystack library is not available at the moment. Please try again later.');
        return;
      }

      const handler = window.PaystackPop.setup({
        key: 'pk_test_2d7be4e2f18d785daedd28037f85023f37cd5ba9',
        email: customerEmail,
        amount: Number(price) * 100, // Ensure amount is multiplied by 100 for Kobo
        currency: 'NGN',
        callback: (response) => {
          // Log the response for debugging
          console.log('Payment response:', response);

          if (response && response.reference) {
            fetch('/api/v1/order/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ reference: response.reference }),
            })
              .then((res) => res.json())
              .then((data) => {
                if (data.success) {
                  alert('Payment successful!');
                } else {
                  alert('Payment verification failed. Please try again.');
                }
              })
              .catch((err) => console.error('Error verifying payment:', err));
          } else {
            alert('No payment reference was returned. Please contact support.');
          }
        },
        onClose: () => {
          alert('Payment was not completed, window closed.');
        },
      });

      handler.openIframe();
    } catch (error) {
      console.error('Error initializing Paystack:', error);
      alert('Failed to load Paystack script. Please try again later.');
    }
  };

  // Check if Paystack script is loaded when component mounts
  useEffect(() => {
    loadPaystackScript()
      .then(() => setPaystackLoaded(true))
      .catch(() => setPaystackLoaded(false));
  }, []);

  return (
    <button
      onClick={initializePayment}
      className="px-10 py-2 bg-orange-500 text-white rounded-md hover:shadow-lg"
      disabled={!paystackLoaded || !customerEmail || !price}
    >
      Pay Now
    </button>
  );
};

export default PaystackPayment;
