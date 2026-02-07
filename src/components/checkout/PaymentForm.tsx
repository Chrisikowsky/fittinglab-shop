"use client";

import { useEffect, useState } from "react";
import { sdk } from "@/lib/medusa";
import { Loader2, CreditCard, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
// import { useCart } from "@/context/CartContext"; // Use refresh logic after order complete? Usually redirect.

interface PaymentFormProps {
    cart: any;
    onSuccess: (order: any) => void;
    onBack: () => void;
}

export function PaymentForm({ cart, onSuccess, onBack }: PaymentFormProps) {
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [sessions, setSessions] = useState<any[]>([]);
    const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProviders = async () => {
            if (!cart?.region_id) return;
            try {
                // Fetch available payment providers for the region
                const { payment_providers } = await sdk.store.payment.listPaymentProviders({
                    region_id: cart.region_id
                });

                setSessions(payment_providers.map((p: any) => ({
                    id: p.id,
                    provider_id: p.id, // Map for compatibility with previous UI code
                    is_provider: true // Flag to distinguish from actual sessions
                })));

                // If only one, auto-select?
                if (payment_providers.length === 1) {
                    setSelectedProviderId(payment_providers[0].id);
                }
            } catch (e: any) {
                console.error("Error fetching payment providers:", e);
                setError("Konnte Zahlungsarten nicht laden. " + e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProviders();
    }, [cart.region_id]);

    const handlePlaceOrder = async () => {
        if (!selectedProviderId) return;
        setProcessing(true);
        setError(null);

        try {
            // 1. Initiate Payment Session (create collection if needed logic handled by SDK usually, or independent)
            // For Medusa V2, we initiate a session for the chosen provider.
            // API only expects provider_id in body usually for initiate-payment-session
            await sdk.store.payment.initiatePaymentSession(cart, {
                provider_id: selectedProviderId,
            });

            // 2. Complete Cart
            const response = await sdk.store.cart.complete(cart.id);

            // 3. Handle response
            if (response.type === "order") {
                onSuccess(response.order);
            } else {
                throw new Error("Bestellung konnte nicht abgeschlossen werden (Not an order type).");
            }

        } catch (e: any) {
            console.error("Error placing order:", e);
            setError(e.message || "Fehler beim Abschluss der Bestellung.");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;

    // Manual Override for MVP if no providers found (System Payment not configured correctly?)
    // But we need a session to complete. 
    // If sessions empty, show warning.

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold mb-4 text-[#329ebf]">3. Zahlung & Abschluss</h3>

            {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}

            <div className="space-y-3">
                {/* Mock Manual Payment if sessions empty for now? No, stick to real flow. */}
                {sessions.length === 0 && (
                    <div className="p-4 bg-yellow-50 text-yellow-800">
                        Keine Zahlungsmethoden verfügbar. (Ist ein Region-Payment-Provider konfiguriert?)
                    </div>
                )}

                {sessions.map((session) => (
                    <div
                        key={session.id}
                        onClick={() => setSelectedProviderId(session.provider_id)}
                        className={cn(
                            "p-4 border rounded-xl cursor-pointer transition-all flex items-center justify-between group",
                            selectedProviderId === session.provider_id
                                ? "border-[#329ebf] bg-[#329ebf]/5 shadow-sm"
                                : "border-slate-200 hover:border-[#329ebf]/50 bg-white"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-slate-800 capitalize">
                                {session.provider_id === "pp_system_default" ? "Vorkasse / Rechnung" : session.provider_id}
                            </span>
                        </div>
                        {selectedProviderId === session.provider_id && <Lock className="w-4 h-4 text-[#329ebf]" />}
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
                    onClick={handlePlaceOrder}
                    disabled={processing || !selectedProviderId}
                    className="flex-1 py-4 bg-gradient-to-r from-[#329ebf] to-[#3a6297] hover:shadow-lg hover:scale-[1.02] text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {processing ? <Loader2 className="animate-spin" /> : "Kostenpflichtig bestellen"}
                </button>
            </div>
        </div>
    );
}
