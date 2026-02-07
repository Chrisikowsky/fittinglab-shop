"use client";

import { useEffect, useState } from "react";
import { sdk } from "@/lib/medusa";
import { Loader2, Truck, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShippingOptionsProps {
    cart: any;
    onSuccess: (updatedCart: any) => void;
    onBack: () => void;
}

export function ShippingOptions({ cart, onSuccess, onBack }: ShippingOptionsProps) {
    const [options, setOptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

    useEffect(() => {
        const fetchOptions = async () => {
            if (!cart?.id) return;
            try {
                // Fetch shipping options for the cart's region
                // With Medusa V2 store API, it's fulfillment/shipping-options? cart_id=...
                // SDK: sdk.store.fulfillment.listCartOptions({ cart_id: cart.id }) or similar?
                // Let's check typical patterns. Often it is list for cart.
                const { shipping_options } = await sdk.store.fulfillment.listCartOptions({
                    cart_id: cart.id
                });
                setOptions(shipping_options);

                // Pre-select if already chosen
                if (cart.shipping_methods?.[0]?.shipping_option_id) {
                    setSelectedOptionId(cart.shipping_methods[0].shipping_option_id);
                }
            } catch (e) {
                console.error("Error fetching shipping options:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchOptions();
    }, [cart.id]);

    const handleSubmit = async () => {
        if (!selectedOptionId) return;
        setSubmitting(true);
        try {
            const { cart: updatedCart } = await sdk.store.cart.addShippingMethod(cart.id, {
                option_id: selectedOptionId,
            });
            onSuccess(updatedCart);
        } catch (e) {
            console.error("Error setting shipping method:", e);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-[#329ebf]" /></div>;
    }

    if (options.length === 0) {
        return (
            <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg">
                Keine Versandarten für Ihre Adresse gefunden. Bitte prüfen Sie Ihre Adresse.
                <button onClick={onBack} className="block mt-2 font-bold underline">Zurück zur Adresse</button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4 text-[#329ebf]">2. Versandart wählen</h3>

            <div className="space-y-3">
                {options.map((option) => (
                    <div
                        key={option.id}
                        onClick={() => setSelectedOptionId(option.id)}
                        className={cn(
                            "p-4 border rounded-xl cursor-pointer transition-all flex items-center justify-between group",
                            selectedOptionId === option.id
                                ? "border-[#329ebf] bg-[#329ebf]/5 shadow-sm"
                                : "border-slate-200 hover:border-[#329ebf]/50 bg-white"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                                selectedOptionId === option.id ? "bg-[#329ebf] text-white" : "bg-slate-100 text-slate-400 group-hover:bg-[#329ebf]/10"
                            )}>
                                <Truck className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800">{option.name}</p>
                                <p className="text-sm text-slate-500">Standardversand</p>
                            </div>
                        </div>
                        <div className="font-bold text-slate-900 font-mono">
                            {((option.amount || 0) / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR" })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex gap-4 pt-4">
                <button
                    onClick={onBack}
                    className="px-6 py-4 text-slate-500 font-medium hover:text-slate-800 transition-colors"
                >
                    Zurück
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={submitting || !selectedOptionId}
                    className="flex-1 py-4 bg-[#329ebf] hover:bg-[#288aa8] text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {submitting ? <Loader2 className="animate-spin" /> : "Weiter zur Zahlung"}
                </button>
            </div>
        </div>
    );
}
