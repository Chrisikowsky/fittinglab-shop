"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { sdk } from "@/lib/medusa";
import { CheckCircle, Package, ArrowRight, Loader2 } from "lucide-react";

export default function OrderConfirmedPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { order } = await sdk.store.order.retrieve(id, {
                    fields: "+items.variant.product.title,+items.thumbnail,+shipping_address,+total,+subtotal,+tax_total,+shipping_total"
                });
                setOrder(order);
            } catch (e) {
                console.error("Error fetching order:", e);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchOrder();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex text-[#329ebf] items-center justify-center bg-[var(--background)]">
                <Loader2 className="w-12 h-12 animate-spin" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] px-4 text-center">
                <h1 className="text-2xl font-bold mb-4">Bestellung nicht gefunden</h1>
                <p className="text-slate-500 mb-8">Wir konnten Ihre Bestellung leider nicht finden.</p>
                <Link href="/" className="px-6 py-3 bg-[#329ebf] text-white rounded-lg">Zurück zum Shop</Link>
            </div>
        );
    }

    const address = order.shipping_address;

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4">
            <div className="max-w-3xl mx-auto space-y-8">

                {/* Success Header */}
                <div className="text-center space-y-4">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Vielen Dank für Ihre Bestellung!</h1>
                    <p className="text-lg text-slate-500">
                        Wir haben Ihre Bestellung <span className="font-mono font-bold text-slate-800">#{order.display_id}</span> erhalten.
                    </p>
                    <p className="text-slate-400 text-sm">Eine Bestätigung wurde an <span className="font-medium text-slate-600">{order.email}</span> gesendet.</p>
                </div>

                {/* Tracking Info (Mock) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                        <Package className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="font-bold text-slate-800 mb-1">Status: In Bearbeitung</p>
                        <p className="text-sm text-slate-500">Wir bereiten Ihre Artikel für den Versand vor.</p>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Order Items */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="font-bold text-lg mb-4 text-slate-800 border-b border-slate-100 pb-2">Bestellte Artikel</h3>
                        <div className="space-y-4">
                            {order.items.map((item: any) => (
                                <div key={item.id} className="flex gap-4 items-start">
                                    <div className="w-12 h-12 bg-slate-50 rounded-lg overflow-hidden border border-slate-100 flex-shrink-0 relative">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        {item.thumbnail && <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />}
                                        <span className="absolute bottom-0 right-0 bg-slate-100 text-[10px] w-4 h-4 flex items-center justify-center rounded-tl font-bold text-slate-600">{item.quantity}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-800 truncate">{item.title}</p>
                                        <p className="text-xs text-slate-500">{item.variant?.product?.title}</p>
                                    </div>
                                    <div className="text-sm font-mono font-bold text-slate-700">
                                        {((item.total || 0) / 100).toLocaleString("de-DE", { style: "currency", currency: order.currency_code.toUpperCase() })}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-slate-100 mt-4 pt-4 flex justify-between items-center">
                            <span className="font-bold text-slate-900">Gesamtbetrag</span>
                            <span className="font-bold text-lg text-[#329ebf] font-mono">
                                {((order.total || 0) / 100).toLocaleString("de-DE", { style: "currency", currency: order.currency_code.toUpperCase() })}
                            </span>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
                        <h3 className="font-bold text-lg mb-4 text-slate-800 border-b border-slate-100 pb-2">Lieferadresse</h3>
                        {address ? (
                            <address className="not-italic text-slate-600 space-y-1">
                                <p className="font-bold text-slate-800">{address.first_name} {address.last_name}</p>
                                <p>{address.company}</p>
                                <p>{address.address_1}</p>
                                <p>{address.address_2}</p>
                                <p>{address.postal_code} {address.city}</p>
                                <p className="uppercase font-medium text-slate-400 text-xs mt-2">{address.country_code}</p>
                            </address>
                        ) : (
                            <p className="text-slate-400 italic">Keine Adresse hinterlegt</p>
                        )}
                    </div>
                </div>

                <div className="text-center pt-8">
                    <Link href="/" className="inline-flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all hover:scale-105 shadow-lg">
                        Zurück zum Shop
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
