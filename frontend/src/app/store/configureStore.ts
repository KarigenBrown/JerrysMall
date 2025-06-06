import {configureStore} from "@reduxjs/toolkit";
import {counterSlice} from "../../feature/contact/counterSlice.ts";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {basketSlice} from "../../feature/basket/basketSlice.ts";
import {catalogSlice} from "../../feature/catalog/catalogSlice.ts";
import {accountSlice} from "../../feature/account/accountSlice.ts";

// export function configureStore() {
//     return createStore(counterReducer)
// }

export const store = configureStore({
    reducer: {
        counter: counterSlice.reducer,
        basket: basketSlice.reducer,
        catalog: catalogSlice.reducer,
        account: accountSlice.reducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector