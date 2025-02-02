import {createAsyncThunk, createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import {Product, ProductParams} from "../../app/model/product.ts";
import agent from "../../app/api/agent.ts";
import {RootState} from "../../app/store/configureStore.ts";
import {MetaData} from "../../app/model/pagination.ts";

interface CatalogState {
    productsLoaded: boolean,
    filtersLoaded: boolean,
    status: string,
    types: string[],
    brands: string[],
    productParams: ProductParams,
    metaData: MetaData | null
}

const productAdapter = createEntityAdapter<Product>()

function getAxiosParams(productParams: ProductParams) {
    const params = new URLSearchParams()
    params.append("pageNumber", productParams.pageNumber.toString())
    params.append("pageSize", productParams.pageSize.toString())
    params.append("orderBy", productParams.orderBy)
    if (productParams.searchTerm) {
        params.append("searchTerm", productParams.searchTerm)
    }
    if (productParams.types.length > 0) {
        params.append("types", productParams.types.toString())
    }
    if (productParams.brands.length > 0) {
        params.append("brands", productParams.brands.toString())
    }
    return params
}

export const fetchProductsAsync = createAsyncThunk<Product[], void, { state: RootState }>(
    "catalog/fetchProductsAsync",
    async (_, thunkAPI) => {
        const params = getAxiosParams(thunkAPI.getState().catalog.productParams)
        try {
            const response = await agent.Catalog.list(params)
            thunkAPI.dispatch(setMetaData(response.metaData))
            return response.items
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const fetchProductByIdAsync = createAsyncThunk<Product, number>(
    "catalog/fetchProductByIdAsync",
    async (productId, thunkAPI) => {
        try {
            return await agent.Catalog.details(productId)
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const fetchFilters = createAsyncThunk(
    "catalog/fetchFilters",
    async (_, thunkAPI) => {
        try {
            return await agent.Catalog.fetchFilters()
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

function initParams() {
    return {
        pageNumber: 1,
        pageSize: 6,
        orderBy: "name",
        types: [],
        brands: []
    }
}

export const catalogSlice = createSlice({
    name: "catalog",
    initialState: productAdapter.getInitialState<CatalogState>({
        productsLoaded: false,
        filtersLoaded: false,
        status: "idle",
        types: [],
        brands: [],
        productParams: initParams(),
        metaData: null
    }),
    reducers: {
        setProductParams: (state, action) => {
            state.productsLoaded = false
            state.productParams = {...state.productParams, ...action.payload, pageNumber: 1}
        },
        setPageNumber: (state, action) => {
            state.productsLoaded = false
            state.productParams = {...state.productParams, ...action.payload}
        },
        setMetaData: (state, action) => {
            state.metaData = action.payload
        },
        resetProductParams: (state) => {
            state.productParams = initParams()
        }
    },
    extraReducers: (builder => {
        builder.addCase(fetchProductsAsync.pending, (state) => {
            state.status = "pendingFetchProducts"
        })
        builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
            productAdapter.setAll(state, action.payload)
            state.status = "idle"
            state.productsLoaded = true
        })
        builder.addCase(fetchProductsAsync.rejected, (state, action) => {
            console.log(action.payload)
            state.status = "idle"
        })

        builder.addCase(fetchProductByIdAsync.pending, (state) => {
            state.status = "pendingFetchProduct"
        })
        builder.addCase(fetchProductByIdAsync.fulfilled, (state, action) => {
            productAdapter.upsertOne(state, action.payload)
            state.status = "idle"
        })
        builder.addCase(fetchProductByIdAsync.rejected, (state, action) => {
            console.log(action)
            state.status = "idle"
        })

        builder.addCase(fetchFilters.pending, (state) => {
            state.status = "pendingFetchFilters"
        })
        builder.addCase(fetchFilters.fulfilled, (state, action) => {
            state.types = action.payload.types
            state.brands = action.payload.brands
            state.filtersLoaded = true
            state.status = "idle"
        })
        builder.addCase(fetchFilters.rejected, (state, action) => {
            console.log(action.payload)
            state.status = "idle"
        })
    })
})

export const productSelectors = productAdapter.getSelectors((state: RootState) => state.catalog)

export const {setProductParams, setMetaData, resetProductParams, setPageNumber} = catalogSlice.actions