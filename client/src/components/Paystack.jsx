import React, { useEffect, useState } from 'react';

const PaystackPayment = ({ email, amount }) => {
  const [paystackLoaded, setPaystackLoaded] = useState(false);

  // Load Paystack script dynamically
  const loadPaystackScript = () => {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]')) {
        resolve(); // If the script is already loaded
      } else {
        const script = document.createElement('script');
        script.src = "https://js.paystack.co/v1/inline.js";
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      }
    });
  };

  // Initialize payment after Paystack script is loaded
  const initializePayment = async () => {
    try {
      // Wait until the Paystack script is fully loaded
      await loadPaystackScript();
      if (!window.PaystackPop) {
        alert('Paystack library is not available at the moment. Please try again later.');
        return;
      }

      const handler = window.PaystackPop.setup({
        key: "pk_test_2d7be4e2f18d785daedd28037f85023f37cd5ba9", // Replace with your public Paystack key
        email: email,
        amount: amount * 100, // Paystack accepts amount in kobo (Naira x 100)
        currency: 'NGN',
        callback: (response) => {
          // Send reference to the server for verification
          fetch('/api/verify-transaction', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reference: response.reference }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.success) {
                alert('Payment successful!');
                // Update UI, fulfill order, etc.
              } else {
                alert('Payment verification failed. Please try again.');
              }
            })
            .catch((err) => console.error('Error verifying payment:', err));
        },
        onClose: () => {
          alert('Payment was not completed, window closed.');
        },
      });
      handler.openIframe();
    } catch (error) {
      console.error('Error loading Paystack script:', error);
      alert('Failed to load Paystack script. Please try again later.');
    }
  };

  // Check if Paystack script is loaded when component mounts
  useEffect(() => {
    loadPaystackScript().then(() => setPaystackLoaded(true)).catch((error) => {
      console.error('Failed to load Paystack script:', error);
      setPaystackLoaded(false);
    });
  }, []);

  return (
    <button
      onClick={initializePayment}
      className="btn btn-primary"
      disabled={!paystackLoaded} // Disable the button if Paystack script is not loaded
    >
      Pay Now
    </button>
  );
};

export default PaystackPayment;
