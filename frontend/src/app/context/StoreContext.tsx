import {Basket} from "../model/basket.ts";
import {createContext, PropsWithChildren, useContext, useState} from "react";

interface StoreContextValue {
    basket: Basket | null,
    setBasket: (basket: Basket) => void,
    removeItem: (productId: number, quantity: number) => void,

}

// eslint-disable-next-line react-refresh/only-export-components
export const StoreContext = createContext<StoreContextValue | undefined>(undefined)

// eslint-disable-next-line react-refresh/only-export-components
export function useStoreContext() {
    const context = useContext(StoreContext)

    if (context === undefined) {
        throw Error("Oops - we do not seem to be inside the provider")
    }

    return context
}

export function StoreProvider({children}: PropsWithChildren<unknown>) {
    const [basket, setBasket] = useState<Basket | null>(null)

    function removeItem(productId: number, quantity: number) {
        if (!basket) {
            return;
        }
        const items = [...basket.items]
        const itemIndex = items.findIndex(i => i.productId === productId)
        if (itemIndex >= 0) {
            items[itemIndex].quantity -= quantity
            if (items[itemIndex].quantity === 0) {
                items.splice(itemIndex, 1)
            }
            setBasket(prevState => {
                return {...prevState!, items}
            })
        }
    }

    return (
        <StoreContext.Provider value={{basket, setBasket, removeItem}}>
            {children}
        </StoreContext.Provider>
    )
}