import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

// Async thunk to fetch categories
export const get_category = createAsyncThunk(
    'product/get_category',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/home/get-categorys');
            return data;
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);

// Async thunk to fetch all products
export const get_products = createAsyncThunk(
    'product/get_products',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/home/get-products');
            return data;
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);

// Async thunk to fetch a single product by slug
export const get_product = createAsyncThunk(
    'product/get_product',
    async (slug, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/home/get-product/${slug}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);

// Async thunk to get products by price range
export const price_range_product = createAsyncThunk(
    'product/price_range_product',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/home/price-range-latest-product');
            return data;
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);

// Async thunk to fetch banners
export const get_banners = createAsyncThunk(
    'product/get_banners',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/banners');
            return data;
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);

// Async thunk to query products by specific filters
export const query_products = createAsyncThunk(
    'product/query_products',
    async (query, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/home/query-products?category=${query.category}&&rating=${query.rating}&&lowPrice=${query.low}&&highPrice=${query.high}&&sortPrice=${query.sortPrice}&&pageNumber=${query.pageNumber}&&searchValue=${query.searchValue ? query.searchValue : ''}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);

// Async thunk for customer review submission
export const customer_review = createAsyncThunk(
    'review/customer_review',
    async (info, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/home/customer/submit-review', info);
            return data;
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);

// Async thunk to fetch reviews
export const get_reviews = createAsyncThunk(
    'review/get_reviews',
    async ({ productId, pageNumber }, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/home/customer/get-reviews/${productId}?pageNo=${pageNumber}`);
            return data;
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);

// Initial state for home reducer
const initialState = {
    categorys: [],
    products: [],
    totalProduct: 0,
    parPage: 4,
    latest_product: [],
    topRated_product: [],
    discount_product: [],
    priceRange: {
        low: 0,
        high: 100,
    },
    product: {},
    relatedProducts: [],
    moreProducts: [],
    successMessage: '',
    errorMessage: '',
    totalReview: 0,
    rating_review: [],
    reviews: [],
    banners: [],
    loading: false, // Loading state
};

// Home reducer with slice and extra reducers
export const homeReducer = createSlice({
    name: 'home',
    initialState,
    reducers: {
        messageClear: (state) => {
            state.successMessage = '';
            state.errorMessage = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(get_category.pending, (state) => {
                state.loading = true;
            })
            .addCase(get_category.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.categorys = payload.categorys;
            })
            .addCase(get_category.rejected, (state) => {
                state.loading = false;
                state.errorMessage = 'Failed to load categories';
            })

            .addCase(get_products.pending, (state) => {
                state.loading = true;
            })
            .addCase(get_products.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.products = payload.products;
                state.latest_product = payload.latest_product;
                state.topRated_product = payload.topRated_product;
                state.discount_product = payload.discount_product;
            })
            .addCase(get_products.rejected, (state) => {
                state.loading = false;
                state.errorMessage = 'Failed to load products';
            })

            .addCase(get_product.pending, (state) => {
                state.loading = true;
            })
            .addCase(get_product.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.product = payload.product;
                state.relatedProducts = payload.relatedProducts;
                state.moreProducts = payload.moreProducts;
            })
            .addCase(get_product.rejected, (state) => {
                state.loading = false;
                state.errorMessage = 'Failed to load product';
            })

            .addCase(price_range_product.pending, (state) => {
                state.loading = true;
            })
            .addCase(price_range_product.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.latest_product = payload.latest_product;
                state.priceRange = payload.priceRange;
            })
            .addCase(price_range_product.rejected, (state) => {
                state.loading = false;
                state.errorMessage = 'Failed to load price range products';
            })

            .addCase(query_products.pending, (state) => {
                state.loading = true;
            })
            .addCase(query_products.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.products = payload.products;
                state.totalProduct = payload.totalProduct;
                state.parPage = payload.parPage;
            })
            .addCase(query_products.rejected, (state) => {
                state.loading = false;
                state.errorMessage = 'Failed to query products';
            })

            .addCase(customer_review.pending, (state) => {
                state.loading = true;
            })
            .addCase(customer_review.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.successMessage = payload.message;
            })
            .addCase(customer_review.rejected, (state) => {
                state.loading = false;
                state.errorMessage = 'Failed to submit review';
            })

            .addCase(get_reviews.pending, (state) => {
                state.loading = true;
            })
            .addCase(get_reviews.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.reviews = payload.reviews;
                state.totalReview = payload.totalReview;
                state.rating_review = payload.rating_review;
            })
            .addCase(get_reviews.rejected, (state) => {
                state.loading = false;
                state.errorMessage = 'Failed to load reviews';
            })

            .addCase(get_banners.pending, (state) => {
                state.loading = true;
            })
            .addCase(get_banners.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.banners = payload.banners;
            })
            .addCase(get_banners.rejected, (state) => {
                state.loading = false;
                state.errorMessage = 'Failed to load banners';
            });
    },
});

// Exporting actions and reducer
export const { messageClear } = homeReducer.actions;
export default homeReducer.reducer;
