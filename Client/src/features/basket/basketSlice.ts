import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { Basket } from "../../app/models/Basket";
import agent from "../../app/api/agent";
import { getCookie } from "../../app/util/util";

interface BasketState {
    basket: Basket | null,
    status: string
}

const initialState: BasketState = {
    basket: null,
    status: 'idle'
}

export const addBasketItemAsync = createAsyncThunk<Basket, {productId: number, quantity?: number}>(
    'basket/addBasketItem',
    async ({productId, quantity = 1}) => {
        try{
            return await agent.basket.addItem(productId, quantity);
        }
        catch(error){
            console.log(error);
        }
    }
)

export const removeBasketItemAsync = createAsyncThunk<Basket, {productId: number, quantity?: number, name?: string}>(
    'basket/removeBasketItem',
    async ({productId, quantity = 1}) => {
        try{
            return await agent.basket.removeItem(productId, quantity);
        }
        catch(error){
            console.log(error);
        }
    }
)

export const getBasketAsync = createAsyncThunk<Basket>(
    'basket/getBasket',
    async () => {
        try{
            return await agent.basket.getBasket();
        }
        catch(error){
            console.log(error);
        }
    },
    {
        condition: () => {
            if (!getCookie('buyerId')) return false
        }
    }
)

export const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers: {
        setBasket: (state, action) => {
            state.basket = action.payload;
        },
        clearBasket: (state) => {
            state.basket = null
        }
    },
    extraReducers(builder) {
        builder.addCase(addBasketItemAsync.pending, (state, action) => {
            state.status = 'pendingAddItem'+action.meta.arg.productId;
        })
        builder.addCase(removeBasketItemAsync.fulfilled, (state, action) => {
            const {productId, quantity} = action.meta.arg;
            const itemIndex = state.basket?.items.findIndex(i => i.productId === productId) ?? -1;
            if(itemIndex ===-1) return;
            state.basket!.items[itemIndex].quantity -= quantity!;
            if(state.basket?.items[itemIndex].quantity === 0){
                state.basket.items.splice(itemIndex, 1);
            }
            state.status = 'idle';
        })
        builder.addCase(removeBasketItemAsync.rejected, (state) => {
            state.status = 'idle';
        })
        builder.addCase(removeBasketItemAsync.pending, (state, action) => {
            state.status = 'pendingRemoveItem'+action.meta.arg.productId+action.meta.arg.name;
        })
        builder.addMatcher(isAnyOf(getBasketAsync.fulfilled, addBasketItemAsync.fulfilled), (state, action) => {
            state.basket = action.payload;
            state.status = 'idle';
        })
        builder.addMatcher(isAnyOf(getBasketAsync.rejected, addBasketItemAsync.rejected), (state) => {
            state.status = 'idle';
        })
    },
})

export const { setBasket, clearBasket } = basketSlice.actions