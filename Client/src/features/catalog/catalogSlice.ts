import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Product, ProductParams } from "../../app/models/Product";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configureStore";
import { MetaData } from "../../app/models/Pagination";

interface catalogState {
    productsLoaded: boolean;
    filtersLoaded: boolean;
    status: string;
    brands: string[];
    types: string[];
    productsParams: ProductParams;
    metaData?: MetaData
}
const productsAdapter = createEntityAdapter<Product>();

function getAxiosParams(productParams: ProductParams) {
    const params = new URLSearchParams();
    if (productParams.brands) params.append('brands', productParams.brands.toString());
    if (productParams.types) params.append('types', productParams.types.toString())
    if (productParams.searchTerm) params.append('searchTerm', productParams.searchTerm)
    if (productParams.pageNumber) params.append('pageNumber', productParams.pageNumber.toString())
    if (productParams.pageSize) params.append('pageSize', productParams.pageSize.toString())
    if (productParams.orderBy) params.append('orderBy', productParams.orderBy.toString())
    return params
}
export const fetchProductsAsync = createAsyncThunk<Product[], void, { state: RootState }>(
    'catalog/fetchProductsAsync',
    async (_, thunkAPI) => {
        debugger
        try {
            const params = getAxiosParams(thunkAPI.getState().catalog.productsParams)
            const response = await agent.catalog.productsList(params);
            console.log("response",response)
            thunkAPI.dispatch(setMetaData(response.metaData));
            return response.items;
        }
        catch (error) {
            console.log(error);
        }
    }
)

export const fetchProductAsync = createAsyncThunk<Product, number>(
    'catalog/fetchProductAsync',
    async (id, thunkAPI) => {
        try {
            return await agent.catalog.productDetails(id);
        }
        catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data })
        }
    }
)

export const fetchFiltersAsync = createAsyncThunk(
    'catalog/fetchFiltersAsync',
    async (_, thunkAPI) => {
        try {
            return await agent.catalog.fetchFilters();
        }
        catch (error: any) {
            return thunkAPI.rejectWithValue({ error: error.data })
        }
    }
)

function initParams() {
    return {
        brands: [],
        types : [],
        orderBy: 'name'
    }
}

export const catalogSlice = createSlice({
    name: 'catalog',
    initialState: productsAdapter.getInitialState<catalogState>({
        productsLoaded: false,
        filtersLoaded: false,
        status: 'idle',
        brands: [],
        types: [],
        productsParams: initParams(),
        metaData: undefined
    }),
    reducers: {
        setParams: (state, action) => {
            state.productsLoaded = false;
            state.productsParams = { ...state.productsParams, ...action.payload, pageNumber: 1 };
        },
        setPageNumber: (state, action) => {
            state.productsLoaded = false;
            state.productsParams = { ...state.productsParams, ...action.payload };
        },
        resetParams: (state) => {
            state.productsParams = initParams();
        },
        setMetaData: (state, action) => {
            state.metaData = action.payload
        }
    },
    extraReducers: (builder => {
        builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
            productsAdapter.setAll(state, action.payload);
            state.productsLoaded = true;
            state.status = 'idle';
        })
        builder.addCase(fetchProductsAsync.pending, (state) => {
            state.status = 'pendingFetchProducts';
        })
        builder.addCase(fetchProductsAsync.rejected, (state) => {
            state.status = 'idle';
        })
        builder.addCase(fetchProductAsync.fulfilled, (state, action) => {
            productsAdapter.upsertOne(state, action.payload);
            state.status = 'idle';
        })
        builder.addCase(fetchProductAsync.pending, (state) => {
            state.status = 'pendingFetchProduct';
        })
        builder.addCase(fetchProductAsync.rejected, (state) => {
            state.status = 'idle';
        })
        builder.addCase(fetchFiltersAsync.fulfilled, (state, action) => {
            state.brands = action.payload.brands;
            state.types = action.payload.types;
            state.filtersLoaded = true;
            state.status = 'idle';
        })
        builder.addCase(fetchFiltersAsync.pending, (state) => {
            state.status = 'pendingFetchFilters';
        })
        builder.addCase(fetchFiltersAsync.rejected, (state) => {
            state.status = 'idle';
        })
    })
})

export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog);
export const { setParams, resetParams, setMetaData, setPageNumber } = catalogSlice.actions;
