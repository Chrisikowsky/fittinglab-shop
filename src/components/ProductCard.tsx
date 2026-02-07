"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AddToCartButton } from "./AddToCartButton";
import { QuantitySelector } from "./QuantitySelector";

interface Product {
    id: string;
    handle: string;
    title: string;
    description: string;
    thumbnail: string | null;
    price: string;
    defaultVariantId?: string;
}

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const [quantity, setQuantity] = useState(1);

    // Prevent navigation when clicking controls
    const stopProp = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <div className="block group h-full relative">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="relative glass-card rounded-2xl overflow-hidden bg-white h-full flex flex-col"
            >
                {/* Product Link Wrapper for Image & Title */}
                <Link href={`/products/${product.handle}`} className="flex-grow">
                    {/* Product Image Placeholder - Light & Clean */}
                    <div className={cn("h-48 w-full relative overflow-hidden flex items-center justify-center bg-white")}>
                        {product.thumbnail ? (
                            <Image
                                src={product.thumbnail}
                                alt={product.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-slate-50 flex items-center justify-center backdrop-blur-sm shadow-sm group-hover:scale-110 transition-transform duration-500">
                                {/* Device representation */}
                                <div className="w-16 h-2 bg-slate-200 rounded-full shadow-sm" />
                            </div>
                        )}
                    </div>

                    <div className="p-6 pb-0">
                        <h3 className="text-xl font-bold mb-1 text-slate-800">{product.title}</h3>
                        <p className="text-sm text-slate-500 mb-4 h-10 overflow-hidden text-ellipsis">{product.description}</p>
                    </div>
                </Link>

                {/* Actions Footer (No Link applied here) */}
                <div className="p-6 pt-0 mt-auto">
                    <div className="flex items-center justify-between mt-4">
                        <span className="text-lg font-mono font-bold text-[#329ebf]">{product.price} <span className="text-xs text-slate-400 font-normal">netto</span></span>
                    </div>

                    {/* Quick Add Controls */}
                    <div
                        className="flex items-center gap-2 mt-4"
                        onClick={stopProp} // Safety net
                    >
                        <div className="flex-1">
                            <QuantitySelector
                                value={quantity}
                                onChange={setQuantity}
                                className="h-12 w-full justify-between px-2 bg-slate-50"
                            />
                        </div>

                        {product.defaultVariantId ? (
                            <AddToCartButton
                                variantId={product.defaultVariantId}
                                quantity={quantity}
                                showLabel={false}
                                className="w-12 h-12 p-0 rounded-lg shadow-none"
                            />
                        ) : (
                            <button disabled className="w-12 h-12 flex items-center justify-center bg-slate-100 text-slate-300 rounded-lg cursor-not-allowed">
                                -
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
