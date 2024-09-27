import {
    createSlice,
    createAsyncThunk
} from '@reduxjs/toolkit'
import axios from 'axios'
import { base_url } from '../../utils/config'

export const get_dashboard_index_data = createAsyncThunk(
    'dashboard/get_dashboard_index_data',
    async (userId, {
        rejectWithValue,
        fulfillWithValue,
        getState
    }) => {

        const { token } = getState().auth
        const config = {
            header: {
                Authorization: `Bearer ${token}`
            }
        }
        try {
            const {
                data
            } = await axios.get(`${base_url}/ap/home/customer/gat-dashboard-data/${userId}`, config)
            return fulfillWithValue(data)
        } catch (error) {
            console.log(error.response.data)
        }
    }
)

export const dashboardReducer = createSlice({
    name: 'dashboard',
    initialState: {
        recentOrders: [],
        errorMessage: '',
        successMessage: '',
        totalOrder: 0,
        pendingOrder: 0,
        cancelledOrder: 0
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = ''
            state.successMessage = ''
        }
    },
    extraReducers: {
        [get_dashboard_index_data.fulfilled] : (state,{payload})=>{
            state.totalOrder = payload.totalOrder
            state.pendingOrder = payload.pendingOrder
            state.cancelledOrder = payload.cancelledOrder
            state.recentOrders = payload.recentOrders
        }
    }
})

export const {
    messageClear
} = dashboardReducer.actions
export default dashboardReducer.reducer