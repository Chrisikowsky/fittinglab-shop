"use client";

import { useState } from "react";
import { ShoppingCart, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { sdk } from "@/lib/medusa";

import { useCart } from "@/context/CartContext";

interface AddToCartButtonProps {
    variantId: string;
    quantity?: number;
    className?: string;
    showLabel?: boolean;
}

export function AddToCartButton({ variantId, quantity = 1, className, showLabel = true }: AddToCartButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { refreshCart } = useCart();

    // Helper to get or create a cart ID
    const getCartId = async () => {
        let cartId = localStorage.getItem("cart_id");

        if (!cartId) {
            const { cart } = await sdk.store.cart.create({});
            cartId = cart.id;
            if (cartId) {
                localStorage.setItem("cart_id", cartId);
            }
        }

        return cartId;
    };

    const handleAddToCart = async (e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        setIsLoading(true);
        setIsSuccess(false);

        try {
            const cartId = await getCartId();

            if (!cartId) {
                throw new Error("Failed to create cart");
            }

            await sdk.store.cart.createLineItem(cartId, {
                variant_id: variantId,
                quantity: quantity,
            });

            await refreshCart(); // Update global cart state
            setIsSuccess(true);

            // Reset success state after 2 seconds
            setTimeout(() => setIsSuccess(false), 2000);
        } catch (error) {
            console.error("Error adding to cart:", error);
            // In a real app, you'd show a toast error here
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleAddToCart}
            disabled={isLoading || isSuccess}
            className={cn(
                "py-4 text-white font-bold text-lg rounded-xl transition-all shadow-lg flex items-center justify-center gap-2",
                isSuccess
                    ? "bg-green-500 hover:bg-green-600 shadow-green-500/20"
                    : "bg-[#329ebf] hover:bg-[#3a6297] hover:scale-[1.02] shadow-[#329ebf]/30",
                className
            )}
        >
            {isLoading ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {showLabel && <span>...</span>}
                </>
            ) : isSuccess ? (
                <>
                    <Check className="w-5 h-5" />
                    {showLabel && <span>Hinzugefügt</span>}
                </>
            ) : (
                <>
                    <ShoppingCart className="w-5 h-5" />
                    {showLabel && <span>In den Warenkorb</span>}
                </>
            )}
        </button>
    );
}
