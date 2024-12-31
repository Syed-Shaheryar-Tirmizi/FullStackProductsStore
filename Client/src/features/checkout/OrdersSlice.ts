import { FieldValues } from "react-hook-form";
import agent from "../../app/api/agent";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Orders } from "../../app/models/Orders";

interface OrdersState {
    orderNo: number
    orders: Orders[]
    ordersLoaded: boolean
}

const initialState: OrdersState = {
    orderNo: 0,
    orders: [],
    ordersLoaded: false
}

export const createOrderAsync = createAsyncThunk<number, FieldValues>(
    'orders/createOrder',
    async (data, thunkApi) => {
        try {
            return await agent.orders.createOrder(data);
        }
        catch (error: any) {
            return thunkApi.rejectWithValue({ error: error.data })
        }
    }
)

export const fetchOrdersAsync = createAsyncThunk<Orders[]>(
    'orders/fetchOrdersAsync',
    async (_, thunkApi) => {
        try {
            return await agent.orders.listOrders();
        }
        catch (error: any) {
            return thunkApi.rejectWithValue({ error: error.data })
        }
    }
)

export const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {},
    extraReducers: (builder => {
        builder.addCase(createOrderAsync.fulfilled, (state, action) => {
            state.orderNo = action.payload;
        })
        builder.addCase(fetchOrdersAsync.fulfilled, (state, action) => {
            state.orders = action.payload;
            state.ordersLoaded = true;
        })
        builder.addCase(fetchOrdersAsync.rejected, (state) => {
            state.ordersLoaded = true;
        })
    })
})