"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { sdk } from "@/lib/medusa";
import { useCart } from "@/context/CartContext";
import { AddressForm } from "./checkout/AddressForm";
import { ShippingOptions } from "./checkout/ShippingOptions";
import { PaymentForm } from "./checkout/PaymentForm";
import { CheckCircle, ShieldCheck } from "lucide-react";

type Step = "address" | "shipping" | "payment";

export function CheckoutClient() {
    const { cartId, refreshCart } = useCart(); // Use global cart context
    const [cart, setCart] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState<Step>("address");
    const router = useRouter();

    // Fetch full cart with all necessary fields for checkout
    const fetchCheckoutCart = async () => {
        if (!cartId) return;
        setLoading(true);
        try {
            const { cart: checkoutCart } = await sdk.store.cart.retrieve(cartId, {
                fields: "+email,+shipping_address,+billing_address,+shipping_methods,+items.variant.product.title,+items.thumbnail,+payment_sessions,+total,+subtotal,+tax_total,+shipping_total,+discount_total",
            });
            setCart(checkoutCart);

            // Auto-advance logic based on what's filled?
            if (checkoutCart.shipping_address && checkoutCart.email) {
                if (checkoutCart.shipping_methods?.length > 0) {
                    setCurrentStep("payment");
                } else {
                    setCurrentStep("shipping");
                }
            }
        } catch (e) {
            console.error("Checkout load error:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (cartId) {
            fetchCheckoutCart();
        } else {
            // No cart? Redirect to cart page or empty state
            setLoading(false);
        }
    }, [cartId]);

    const handleAddressSuccess = (updatedCart: any) => {
        setCart(updatedCart);
        setCurrentStep("shipping");
        refreshCart(); // Keep global context in sync
    };

    const handleShippingSuccess = (updatedCart: any) => {
        setCart(updatedCart);
        setCurrentStep("payment");
        refreshCart();
    };

    const handleOrderSuccess = (order: any) => {
        // Clear local cart logic
        localStorage.removeItem("cart_id");
        refreshCart(); // Should clear global state
        router.push(`/order/confirmed/${order.id}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-32 flex justify-center">
                <div className="animate-spin w-8 h-8 border-t-2 border-b-2 border-[#329ebf] rounded-full"></div>
            </div>
        );
    }

    if (!cart || !cart.items?.length) {
        return (
            <div className="min-h-screen pt-32 px-4 text-center">
                <h1 className="text-2xl font-bold mb-4">Ihr Warenkorb ist leer</h1>
                <button onClick={() => router.push("/")} className="text-[#329ebf] underline">Zurück zum Shop</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8">

                {/* Left Column: Form Steps */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-8">
                        <ShieldCheck className="w-6 h-6 text-green-500" />
                        <span className="text-sm font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-100">Sicherer Checkout (SSL)</span>
                    </div>

                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
                        {currentStep === "address" && (
                            <AddressForm cart={cart} onSuccess={handleAddressSuccess} />
                        )}
                        {currentStep === "shipping" && (
                            <ShippingOptions
                                cart={cart}
                                onSuccess={handleShippingSuccess}
                                onBack={() => setCurrentStep("address")}
                            />
                        )}
                        {currentStep === "payment" && (
                            <PaymentForm
                                cart={cart}
                                onSuccess={handleOrderSuccess}
                                onBack={() => setCurrentStep("shipping")}
                            />
                        )}
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:col-span-5">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-32">
                        <h3 className="text-xl font-bold mb-6 text-slate-800">Bestellübersicht</h3>

                        <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
                            {cart.items.map((item: any) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="w-16 h-16 bg-slate-50 rounded-lg relative overflow-hidden flex-shrink-0 border border-slate-100">
                                        {item.thumbnail && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                                        )}
                                        <span className="absolute top-0 right-0 bg-slate-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-bl-lg font-bold">
                                            {item.quantity}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm text-slate-800 truncate">{item.title}</p>
                                        <p className="text-xs text-slate-500">{item.variant?.product?.title}</p>
                                    </div>
                                    <div className="font-mono text-sm font-bold text-slate-700">
                                        {((item.total || 0) / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR" })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-slate-100 pt-4 space-y-2 text-sm">
                            <div className="flex justify-between text-slate-600">
                                <span>Zwischensumme</span>
                                <span>{((cart.subtotal || 0) / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR" })}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Versand</span>
                                <span>{((cart.shipping_total || 0) / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR" })}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Steuern (19%)</span>
                                <span>{((cart.tax_total || 0) / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR" })}</span>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 pt-4 mt-4 flex justify-between items-center">
                            <span className="font-bold text-lg text-slate-900">Gesamtsumme</span>
                            <span className="font-bold text-2xl text-[#329ebf] font-mono">
                                {((cart.total || 0) / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR" })}
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
