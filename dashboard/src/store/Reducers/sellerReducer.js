import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

// Fetch sellers
export const get_seller_request = createAsyncThunk(
    'seller/get_seller_request',
    async ({ parPage, page, searchValue }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/request-seller-get?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`, { withCredentials: true });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : "Error fetching seller requests");
        }
    }
);

export const get_seller = createAsyncThunk(
    'seller/get_seller',
    async (sellerId, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/get-seller/${sellerId}`, { withCredentials: true });
            return data;
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : "Error fetching seller data");
        }
    }
);

export const seller_status_update = createAsyncThunk(
    'seller/seller_status_update',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post(`/seller-status-update`, info, { withCredentials: true });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : "Error updating seller status");
        }
    }
);

export const get_active_sellers = createAsyncThunk(
    'seller/get_active_sellers',
    async ({ parPage, page, searchValue }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/get-sellers?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`, { withCredentials: true });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : "Error fetching active sellers");
        }
    }
);

export const get_deactive_sellers = createAsyncThunk(
    'seller/get_deactive_sellers',
    async ({ parPage, page, searchValue }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/get-deactive-sellers?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`, { withCredentials: true });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : "Error fetching deactive sellers");
        }
    }
);

// Paystack integration actions
export const create_paystack_account = createAsyncThunk(
    'seller/create_paystack_account',
    async (_, { rejectWithValue }) => {
        try {
            const { data: { url } } = await api.get(`/payment/create-paystack-account`, { withCredentials: true });
            window.location.href = url;  // Redirect to Paystack
            return url;  // Optionally return the URL
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : "Error creating Paystack account");
        }
    }
);

export const activate_paystack_account = createAsyncThunk(
    'seller/activate_paystack_account',
    async (activationCode, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.put(`/payment/activate-paystack-account/${activationCode}`, {}, { withCredentials: true });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response ? error.response.data : "Error activating Paystack account");
        }
    }
);

export const sellerReducer = createSlice({
    name: 'seller',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        sellers: [],
        totalSeller: 0,
        seller: ''
    },
    reducers: {
        messageClear: (state) => {
            state.errorMessage = '';
            state.successMessage = '';
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch sellers request
            .addCase(get_seller_request.pending, (state) => {
                state.loader = true;
            })
            .addCase(get_seller_request.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.sellers = payload.sellers;
                state.totalSeller = payload.totalSeller;
            })
            .addCase(get_seller_request.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.message;
            })

            // Get single seller
            .addCase(get_seller.pending, (state) => {
                state.loader = true;
            })
            .addCase(get_seller.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.seller = payload.seller;
            })
            .addCase(get_seller.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.message;
            })

            // Update seller status
            .addCase(seller_status_update.pending, (state) => {
                state.loader = true;
            })
            .addCase(seller_status_update.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.seller = payload.seller;
                state.successMessage = payload.message;
            })
            .addCase(seller_status_update.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.message;
            })

            // Get active sellers
            .addCase(get_active_sellers.pending, (state) => {
                state.loader = true;
            })
            .addCase(get_active_sellers.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.sellers = payload.sellers;
                state.totalSeller = payload.totalSeller;
            })
            .addCase(get_active_sellers.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.message;
            })

            // Activate Paystack account
            .addCase(activate_paystack_account.pending, (state) => {
                state.loader = true;
            })
            .addCase(activate_paystack_account.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message;
            })
            .addCase(activate_paystack_account.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.message;
            });
    }
});

export const { messageClear } = sellerReducer.actions;
export default sellerReducer.reducer;
