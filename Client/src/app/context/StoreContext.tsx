import { createContext, PropsWithChildren, useContext, useState } from "react";
import { Basket } from "../models/Basket";

interface StoreContextValue {
    basket: Basket | null;
    setBasket: (basket: Basket) => void;
    removeItem: (productId: number, quantity: number) => void;
}

export const StoreContext = createContext<StoreContextValue | null>(null);

export function useStoreContext() {
    const context = useContext(StoreContext);
    if (context === null) { // Check for null instead of undefined
        throw new Error('useStoreContext must be used within a StoreProvider');
    }
    return context;
}

export function StoreProvider({ children }: PropsWithChildren<unknown>) {
    const [basket, setBasket] = useState<Basket | null>(null);

    function removeItem(productId: number, quantity: number) {
    setBasket(prevState => {
        if (!prevState) return null;

        // Create a new array for items to ensure immutability
        const updatedItems = prevState.items.map(item =>
            item.productId === productId
                ? { ...item, quantity: item.quantity - quantity }
                : item
        ).filter(item => item.quantity > 0); // Remove items with 0 quantity

        // Return the updated basket object
        return { ...prevState, items: updatedItems };
    });
}


    return (
        <StoreContext.Provider value={{ basket, setBasket, removeItem }}>
            {children}
        </StoreContext.Provider>
    )
}