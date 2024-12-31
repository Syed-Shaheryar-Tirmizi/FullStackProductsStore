import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { User } from "../../app/models/User";
import { FieldValues } from "react-hook-form";
import agent from "../../app/api/agent";
import { routes } from "../../app/router/Routes";
import { setBasket } from "../basket/basketSlice";

interface AccountState {
    user: User | null;
}

const initialState: AccountState = {
    user: null
}

export const logInUser = createAsyncThunk<User, FieldValues>(
    'account/logInUser',
    async (data, thunkAPi) => {
        try {
            const userDto = await agent.account.login(data);
            const {basket, ...user} = userDto;
            if(basket) thunkAPi.dispatch(setBasket(basket));
            localStorage.setItem('user', JSON.stringify(user));
            return user
        }
        catch (error: any) {
            thunkAPi.rejectWithValue({ error: error.data })
        }
    }
)

export const getCurrentUserAsync = createAsyncThunk<User>(
    'account/getCurrentUser',
    async (_, thunkAPi) => {
        thunkAPi.dispatch(setUser(JSON.parse(localStorage.getItem('user')!)));
        try {
            const userDto = await agent.account.currentUser();
            const {basket, ...user} = userDto;
            if(basket) thunkAPi.dispatch(setBasket(basket));
            localStorage.setItem('user', JSON.stringify(user));
            return user
        }
        catch (error: any) {
            thunkAPi.rejectWithValue({ error: error.data })
        }
    },
    {
        condition: () => {
            if (!localStorage.getItem('user')) return false
        }
    }
)

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        logOut: (state) => {
            state.user = null;
            localStorage.removeItem('user');
            routes.navigate('/');
        },
        setUser(state, action) {
            state.user = action.payload
        }
    },
    extraReducers: (builder => {
        builder.addMatcher(isAnyOf(logInUser.fulfilled, getCurrentUserAsync.fulfilled), (state, action) => {
            state.user = action.payload;
        })
        builder.addMatcher(isAnyOf(logInUser.rejected, getCurrentUserAsync.rejected), (_, action) => {
            console.log(action.payload);
        })
    })
})


export const { logOut, setUser } = accountSlice.actions