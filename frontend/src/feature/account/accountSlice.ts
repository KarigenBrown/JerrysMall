import {User} from "../../app/model/user.ts";
import {createAsyncThunk, createSlice, isAnyOf} from "@reduxjs/toolkit";
import {FieldValues} from "react-hook-form";
import agent from "../../app/api/agent.ts";
import {router} from "../../app/router/Routes.tsx";
import {toast} from "react-toastify";
import {setBasket} from "../basket/basketSlice.ts";

interface AccountState {
    user: User | null,
}

const initialState: AccountState = {
    user: null
}

export const signInUserAsync = createAsyncThunk<User, FieldValues>(
    "account/signInUser",
    async (data, thunkAPI) => {
        try {
            const userVo = await agent.Account.login(data)
            const {basket, ...user} = userVo
            if (basket) {
                thunkAPI.dispatch(setBasket(basket))
            }
            localStorage.setItem("user", JSON.stringify(user))
            return user
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const fetchCurrentUserAsync = createAsyncThunk<User>(
    "account/fetchCurrentUser",
    async (_, thunkAPI) => {
        thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem("user")!)))
        try {
            const userVo = await agent.Account.currentUser()
            const {basket, ...user} = userVo
            if (basket) {
                thunkAPI.dispatch(setBasket(basket))
            }
            localStorage.setItem("user", JSON.stringify(user))
            return user
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    },
    {
        condition: () => {
            if (!localStorage.getItem("user")) {
                return false
            }
        }
    }
)

export const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        signOut: (state) => {
            state.user = null
            localStorage.removeItem("user")
            router.navigate("/")
        },
        setUser: (state, action) => {
            state.user = action.payload
        }
    },
    extraReducers: (builder => {
        builder.addCase(fetchCurrentUserAsync.rejected, (state) => {
            state.user = null
            localStorage.removeItem("user")
            toast.error("Session expired - please login again")
            router.navigate("/")
        })

        builder.addMatcher(isAnyOf(signInUserAsync.fulfilled, fetchCurrentUserAsync.fulfilled), (state, action) => {
            state.user = action.payload
        })
        builder.addMatcher(isAnyOf(signInUserAsync.rejected), (_, action) => {
            throw action.payload
        })
    })
})

export const {signOut, setUser} = accountSlice.actions