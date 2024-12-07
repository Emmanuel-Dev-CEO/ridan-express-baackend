import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';


export const verifyPayment = createAsyncThunk(
    'order/verify_payment',
    async (reference, { rejectWithValue }) => {
        try {
            // Check if reference is valid
            if (!reference) {
                console.error('Reference is undefined or null');
                return rejectWithValue('Payment reference is missing');
            }

            // Log reference for debugging
            console.log('Verifying payment with reference:', reference);

            // Make the API call to verify payment using the reference
            const { data } = await api.get(`/api/v2/order/verify-payment/${reference}`);

            // Log successful verification response
            console.log('Payment verification successful:', data);

            return data; // Return the verified payment data
        } catch (error) {
            // Log the error details
            console.error('Error during payment verification:', error);

            // Return error message if API responds with error, or use generic message
            return rejectWithValue(error.response?.data || 'Payment verification failed');
        }
    }
);



export const place_order = createAsyncThunk(
    'order/place_order',
    async ({ price, products, shipping_fee, shippingInfo, userId, navigate, items }, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/home/order/place-order', {
                price, products, shipping_fee, shippingInfo, userId, items,
            });
            navigate('/payment', {
                state: {
                    price: price + shipping_fee,
                    items,
                    orderId: data.orderId,
                }
            });
            return true;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Order placement failed');
        }
    }
);

export const get_orders = createAsyncThunk(
    'order/get_orders',
    async ({ customerId, status }, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/home/customer/orders/${customerId}/${status}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch orders');
        }
    }
);

export const get_order = createAsyncThunk(
    'order/get_order',
    async (orderId, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/home/customer/order/${orderId}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch the order');
        }
    }
);

export const orderReducer = createSlice({
    name: 'order',
    initialState: {
        myOrders: [],
        myOrder: {},
        loading: false,
        errorMessage: '',
        successMessage: '',
        paymentData: null, // Add this line to store payment data
    },
    reducers: {
        messageClear: (state) => {
            state.errorMessage = '';
            state.successMessage = '';
        },
    },
    extraReducers: {
        [get_orders.pending]: (state) => {
            state.loading = true;
        },
        [get_orders.fulfilled]: (state, { payload }) => {
            state.myOrders = payload.orders;
            state.loading = false;
        },
        [get_orders.rejected]: (state, { payload }) => {
            state.loading = false;
            state.errorMessage = payload;
        },
        [get_order.fulfilled]: (state, { payload }) => {
            state.myOrder = payload.order;
        },
        [place_order.fulfilled]: (state) => {
            state.successMessage = 'Order placed successfully';
        },
        [place_order.rejected]: (state, { payload }) => {
            state.errorMessage = payload;
        },
        [verifyPayment.pending]: (state) => {
            state.loading = true; // Set loading state for payment verification
        },
        [verifyPayment.fulfilled]: (state, { payload }) => {
            state.paymentData = payload; // Store the verified payment data
            state.loading = false; // Stop loading
            state.successMessage = 'Payment verified successfully'; // Optional success message
        },
        [verifyPayment.rejected]: (state, { payload }) => {
            state.loading = false; // Stop loading
            state.errorMessage = payload; // Set error message
        },
    }
});

export const { messageClear } = orderReducer.actions;
export default orderReducer.reducer;
