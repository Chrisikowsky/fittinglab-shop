"use client";

import { useState } from "react";
import { AddToCartButton } from "@/components/AddToCartButton";
import { QuantitySelector } from "@/components/QuantitySelector";

interface ProductActionsProps {
    variantId: string;
}

export function ProductActions({ variantId }: ProductActionsProps) {
    const [quantity, setQuantity] = useState(1);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <div className="w-1/3">
                    <QuantitySelector
                        value={quantity}
                        onChange={setQuantity}
                        className="h-14 justify-between px-4 bg-slate-50"
                    />
                </div>
                <div className="flex-1">
                    <AddToCartButton variantId={variantId} quantity={quantity} />
                </div>
            </div>
        </div>
    );
}
