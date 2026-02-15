"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AddToCartButton } from "./AddToCartButton";
import { QuantitySelector } from "./QuantitySelector";
import { ShoppingBag, Eye } from "lucide-react";

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
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative rounded-2xl overflow-hidden bg-white h-full flex flex-col shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(50,158,191,0.12)] transition-shadow duration-300 border border-slate-100/80"
            >
                {/* Product Link Wrapper for Image & Title */}
                <Link href={`/products/${product.handle}`} className="flex-grow">
                    {/* Product Image */}
                    <div className={cn("h-56 w-full relative overflow-hidden bg-gradient-to-b from-slate-50 to-white")}>
                        {product.thumbnail ? (
                            <>
                                <Image
                                    src={product.thumbnail}
                                    alt={product.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                                {/* Subtle gradient overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center">
                                    <ShoppingBag className="w-8 h-8 text-slate-200" />
                                </div>
                            </div>
                        )}

                        {/* Quick view indicator */}
                        <div className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 shadow-sm">
                            <Eye className="w-4 h-4 text-slate-500" />
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-5 pb-2">
                        <h3 className="text-lg font-bold text-slate-800 group-hover:text-[#329ebf] transition-colors duration-200 leading-tight mb-1.5">
                            {product.title}
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
                            {product.description}
                        </p>
                    </div>
                </Link>

                {/* Actions Footer */}
                <div className="p-5 pt-2 mt-auto">
                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-xl font-bold text-[#329ebf] tabular-nums tracking-tight">{product.price}</span>
                        <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">netto</span>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-slate-100 mb-4" />

                    {/* Quick Add Controls */}
                    <div
                        className="flex items-center gap-2"
                        onClick={stopProp}
                    >
                        <div className="flex-1">
                            <QuantitySelector
                                value={quantity}
                                onChange={setQuantity}
                                className="h-11 w-full justify-between px-2 bg-slate-50/80 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors"
                            />
                        </div>

                        {product.defaultVariantId ? (
                            <AddToCartButton
                                variantId={product.defaultVariantId}
                                quantity={quantity}
                                showLabel={false}
                                className="w-11 h-11 p-0 rounded-xl shadow-none hover:scale-105 transition-transform"
                            />
                        ) : (
                            <button disabled className="w-11 h-11 flex items-center justify-center bg-slate-50 text-slate-300 rounded-xl cursor-not-allowed border border-slate-100">
                                <ShoppingBag className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
