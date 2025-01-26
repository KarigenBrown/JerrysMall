import {createStore} from "redux";
import counterReducer from "../../feature/contact/counterReducer.ts";

export function configureStore() {
    return createStore(counterReducer)
}