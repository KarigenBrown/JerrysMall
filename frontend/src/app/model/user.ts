import {Basket} from "./basket.ts";

export interface User {
    email: string,
    token: string,
    basket?: Basket,
    roles?: string[]
}