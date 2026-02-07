"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { sdk } from "@/lib/medusa";

interface CartContextType {
    cart: any;
    cartId: string | null;
    refreshCart: () => Promise<void>;
    updateItem: (lineId: string, quantity: number) => Promise<void>;
    removeItem: (lineId: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<any>(null);
    const [cartId, setCartId] = useState<string | null>(null);

    // Initial load
    useEffect(() => {
        const storedCartId = localStorage.getItem("cart_id");
        if (storedCartId) {
            setCartId(storedCartId);
            fetchCart(storedCartId);
        }
    }, []);

    const fetchCart = async (id: string) => {
        try {
            const { cart: existingCart } = await sdk.store.cart.retrieve(id, {
                fields: "+items.thumbnail,+items.variant.product.title",
            });
            setCart(existingCart);
        } catch (e) {
            console.error("Error fetching cart in context:", e);
            // If 404, maybe clear local storage?
            if ((e as any).status === 404) {
                localStorage.removeItem("cart_id");
                setCart(null);
                setCartId(null);
            }
        }
    };

    const refreshCart = async () => {
        if (cartId) {
            await fetchCart(cartId);
        } else {
            // Check if ID was just set in local storage by another component
            const storedCartId = localStorage.getItem("cart_id");
            if (storedCartId) {
                setCartId(storedCartId);
                await fetchCart(storedCartId);
            }
        }
    };

    const updateItem = async (lineId: string, quantity: number) => {
        if (!cartId) return;
        try {
            const { cart: updatedCart } = await sdk.store.cart.updateLineItem(cartId, lineId, { quantity });
            setCart(updatedCart);
        } catch (e) {
            console.error("Error updating item in context:", e);
        }
    };

    const removeItem = async (lineId: string) => {
        if (!cartId) return;
        try {
            const { cart: updatedCart } = await sdk.store.cart.deleteLineItem(cartId, lineId);
            setCart(updatedCart);
        } catch (e) {
            console.error("Error removing item in context:", e);
        }
    };

    return (
        <CartContext.Provider value={{ cart, cartId, refreshCart, updateItem, removeItem }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
