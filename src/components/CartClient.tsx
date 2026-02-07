"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { sdk } from "@/lib/medusa";
import { QuantitySelector } from "./QuantitySelector";
import { useCart } from "@/context/CartContext";

export default function CartClient() {
    const { cart, updateItem, removeItem } = useCart();
    const [loading, setLoading] = useState(false); // Context handles initial load, but we might want local loading UI? 
    // Actually Context is initialized in layout. Let's rely on cart being null or not.

    // If context is still loading (cartId exists but cart is null), we might show loader.
    // For now, let's just check if cart is present.

    // Note: implementation of updateQuantity and removeItem in Context handles the state update.
    // We just call them.

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#329ebf]"></div>
            </div>
        );
    }

    if (!cart || !cart.items?.length) {
        return (
            <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center text-center px-4">
                <ShoppingBag className="w-16 h-16 text-slate-300 mb-4" />
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Ihr Warenkorb ist leer</h1>
                <p className="text-slate-500 mb-8">Stöbern Sie in unseren Produkten und finden Sie das Richtige für Ihre Praxis.</p>
                <Link href="/" className="px-8 py-3 bg-[#329ebf] text-white rounded-lg font-medium hover:bg-[#288aa8] transition-colors">
                    Zum Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--background)] pt-32 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">Warenkorb</h1>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <ul className="divide-y divide-slate-100">
                        {cart.items.map((item: any) => (
                            <li key={item.id} className="p-6 flex flex-col sm:flex-row items-center gap-6">
                                {/* Thumbnail */}
                                <div className="w-24 h-24 relative rounded-lg overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                                    {item.thumbnail ? (
                                        <Image
                                            src={item.thumbnail}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-slate-300">
                                            <ShoppingBag className="w-8 h-8" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 text-center sm:text-left">
                                    <h3 className="font-bold text-slate-800">{item.product_title || item.title}</h3>
                                    <p className="text-sm text-slate-500">{item.variant_title}</p>
                                    <p className="font-mono text-[#329ebf] mt-1">
                                        {((item.unit_price || 0) / 100).toLocaleString("de-DE", { style: "currency", currency: (cart.currency_code || "EUR").toUpperCase() })}
                                    </p>
                                </div>

                                {/* Quantity */}
                                <QuantitySelector
                                    value={item.quantity}
                                    onChange={(val) => updateItem(item.id, val)}
                                    className="bg-transparent"
                                />

                                {/* Total & Remove */}
                                <div className="flex flex-col items-end gap-2">
                                    <span className="font-bold font-mono text-slate-900">
                                        {(((item.total || item.unit_price * item.quantity) || 0) / 100).toLocaleString("de-DE", { style: "currency", currency: (cart.currency_code || "EUR").toUpperCase() })}
                                    </span>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* Footer / Checkout */}
                    <div className="bg-slate-50 p-6 flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-slate-100">
                        <div className="text-center sm:text-left">
                            <p className="text-sm text-slate-500">Zwischensumme (exkl. Versand)</p>
                            <p className="text-2xl font-bold text-slate-900 font-mono">
                                {((cart.subtotal || cart.total || 0) / 100).toLocaleString("de-DE", { style: "currency", currency: (cart.currency_code || "EUR").toUpperCase() })}
                            </p>
                        </div>
                        <Link href="/checkout" className="px-8 py-4 bg-[#329ebf] hover:bg-[#288aa8] text-white font-bold rounded-xl shadow-lg shadow-[#329ebf]/20 flex items-center gap-2 transition-all hover:scale-105">
                            Zur Kasse
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
