import axios from 'axios';

export const VERIFY_PAYMENT_REQUEST = 'VERIFY_PAYMENT_REQUEST';
export const VERIFY_PAYMENT_SUCCESS = 'VERIFY_PAYMENT_SUCCESS';
export const VERIFY_PAYMENT_FAILURE = 'VERIFY_PAYMENT_FAILURE';

export const verifyPayment = (reference) => async (dispatch) => {
    dispatch({ type: VERIFY_PAYMENT_REQUEST });
    try {
        const { data } = await axios.get(`/api/v2/order/verify-payment/${reference}`);
        dispatch({ type: VERIFY_PAYMENT_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: VERIFY_PAYMENT_FAILURE, payload: error.response.data.message });
    }
};
