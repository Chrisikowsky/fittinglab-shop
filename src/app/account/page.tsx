"use client";

import { useEffect, useState } from "react";
import { useAccount } from "@/context/AccountContext";
import { useRouter } from "next/navigation";
import { Loader2, Package, LogOut, User as UserIcon, MapPin, Plus, Pencil } from "lucide-react";
import Link from "next/link";
import AddressForm from "@/components/account/AddressForm";

export default function AccountPage() {
    const { customer, loading, logout, refreshCustomer } = useAccount();
    const router = useRouter();
    const [editingAddress, setEditingAddress] = useState(false);
    const [orders, setOrders] = useState<any[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(true);

    const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

    useEffect(() => {
        if (!loading && !customer) {
            router.push("/account/login");
        }
    }, [customer, loading, router]);

    // Fetch orders separately via GET /store/orders
    useEffect(() => {
        if (!customer) return;

        const fetchOrders = async () => {
            try {
                const res = await fetch(`${baseUrl}/store/orders`, {
                    method: "GET",
                    headers: {
                        "x-publishable-api-key": publishableKey,
                    },
                    credentials: "include",
                });

                if (res.ok) {
                    const data = await res.json();
                    setOrders(data.orders || []);
                }
            } catch (e) {
                console.error("Failed to fetch orders:", e);
            } finally {
                setOrdersLoading(false);
            }
        };

        fetchOrders();
    }, [customer]);

    if (loading || !customer) {
        return <div className="min-h-screen flex justify-center items-center"><Loader2 className="animate-spin text-[#329ebf] w-8 h-8" /></div>;
    }

    // Get the first (billing) address if it exists
    const billingAddress = customer.addresses && customer.addresses.length > 0
        ? customer.addresses[0]
        : null;

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Mein Konto</h1>
                        <p className="text-slate-500">Willkommen zurück, {customer.first_name}!</p>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Abmelden
                    </button>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Column: Profile + Address */}
                    <div className="space-y-6">
                        {/* Profile Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-[#329ebf]/10 rounded-full flex items-center justify-center text-[#329ebf]">
                                    <UserIcon className="w-6 h-6" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800">Profil</h2>
                            </div>
                            <div className="space-y-3 text-slate-600">
                                <p><span className="font-bold text-slate-900 block text-xs uppercase tracking-wider mb-1">Name</span> {customer.first_name} {customer.last_name}</p>
                                <p><span className="font-bold text-slate-900 block text-xs uppercase tracking-wider mb-1">E-Mail</span> {customer.email}</p>
                                <p className="pt-4 text-xs text-slate-400">Mitglied seit {new Date(customer.created_at).getFullYear()}</p>
                            </div>
                        </div>

                        {/* Billing Address Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-600">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-800">Rechnungsadresse</h2>
                                </div>
                                {billingAddress && !editingAddress && (
                                    <button
                                        onClick={() => setEditingAddress(true)}
                                        className="p-2 text-slate-400 hover:text-[#329ebf] hover:bg-slate-50 rounded-lg transition-colors"
                                        title="Bearbeiten"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {editingAddress ? (
                                <AddressForm
                                    address={billingAddress}
                                    customerName={{ first_name: customer.first_name, last_name: customer.last_name }}
                                    onSaved={() => {
                                        setEditingAddress(false);
                                        refreshCustomer();
                                    }}
                                    onCancel={() => setEditingAddress(false)}
                                />
                            ) : billingAddress ? (
                                <div className="space-y-2 text-sm text-slate-600">
                                    {billingAddress.company && (
                                        <p className="font-semibold text-slate-800">{billingAddress.company}</p>
                                    )}
                                    <p>{billingAddress.first_name} {billingAddress.last_name}</p>
                                    <p>{billingAddress.address_1}</p>
                                    {billingAddress.address_2 && <p>{billingAddress.address_2}</p>}
                                    <p>{billingAddress.postal_code} {billingAddress.city}</p>
                                    <p>{billingAddress.country_code?.toUpperCase()}</p>
                                    {billingAddress.phone && (
                                        <p className="pt-1">
                                            <span className="text-xs text-slate-400 uppercase tracking-wider">Tel:</span> {billingAddress.phone}
                                        </p>
                                    )}
                                    {billingAddress.metadata?.tax_id && (
                                        <p className="pt-1">
                                            <span className="text-xs text-slate-400 uppercase tracking-wider">USt-IdNr:</span> {billingAddress.metadata.tax_id}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-slate-400 text-sm mb-4">Keine Adresse hinterlegt</p>
                                    <button
                                        onClick={() => setEditingAddress(true)}
                                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#329ebf] border border-[#329ebf]/30 rounded-lg hover:bg-[#329ebf]/5 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Adresse hinzufügen
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Orders List */}
                    <div className="md:col-span-2 space-y-6">
                        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Package className="w-5 h-5 text-slate-400" />
                            Bestellhistorie
                        </h2>

                        {ordersLoading ? (
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
                                <Loader2 className="animate-spin text-[#329ebf] w-6 h-6 mx-auto" />
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
                                <p className="text-slate-500 mb-4">Sie haben noch keine Bestellungen aufgegeben.</p>
                                <Link href="/" className="text-[#329ebf] font-medium hover:underline">
                                    Jetzt einkaufen gehen
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order: any) => (
                                    <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-[#329ebf]/30 transition-colors flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="font-bold text-lg text-slate-900">#{order.display_id}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full border ${order.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                    order.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                                                        'bg-slate-100 text-slate-600 border-slate-200'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500">
                                                {new Date(order.created_at).toLocaleDateString("de-DE")} • {order.fulfillment_status}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-mono font-bold text-slate-800">
                                                {((order.total || 0) / 100).toLocaleString("de-DE", { style: "currency", currency: order.currency_code?.toUpperCase() || "EUR" })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
