"use client";

import { useEffect, useState } from "react";
import { useAccount } from "@/context/AccountContext";
import { useRouter } from "next/navigation";
import { Loader2, Package, LogOut, User as UserIcon, MapPin, Plus, Pencil, Clock, CheckCircle2, Truck, PackageCheck, XCircle, type LucideIcon } from "lucide-react";
import Link from "next/link";
import AddressForm from "@/components/account/AddressForm";

// German status labels and styling
const progressSteps: { key: string; label: string }[] = [
    { key: "ordered", label: "Bestellt" },
    { key: "confirmed", label: "Bestätigt" },
    { key: "preparing", label: "Wird vorbereitet" },
    { key: "shipped", label: "Versendet" },
];

function getOrderStatusInfo(status: string, fulfillmentStatus: string): {
    label: string; Icon: LucideIcon; iconBg: string; iconColor: string; badgeBg: string; badgeText: string
} {
    // Cancelled / storniert
    if (status === "canceled") {
        return { label: "Storniert", Icon: XCircle, iconBg: "bg-red-50", iconColor: "text-red-500", badgeBg: "bg-red-50", badgeText: "text-red-700" };
    }
    // Completed + fulfilled
    if (status === "completed" && (fulfillmentStatus === "fulfilled" || fulfillmentStatus === "shipped" || fulfillmentStatus === "delivered")) {
        return { label: "Abgeschlossen", Icon: CheckCircle2, iconBg: "bg-emerald-50", iconColor: "text-emerald-500", badgeBg: "bg-emerald-50", badgeText: "text-emerald-700" };
    }
    // Shipped
    if (fulfillmentStatus === "shipped" || fulfillmentStatus === "fulfilled" || fulfillmentStatus === "partially_shipped") {
        return { label: "Versendet", Icon: Truck, iconBg: "bg-blue-50", iconColor: "text-blue-500", badgeBg: "bg-blue-50", badgeText: "text-blue-700" };
    }
    // Pending payment
    if (status === "pending" && fulfillmentStatus === "not_fulfilled") {
        return { label: "Bestellung erhalten", Icon: Clock, iconBg: "bg-amber-50", iconColor: "text-amber-500", badgeBg: "bg-amber-50", badgeText: "text-amber-700" };
    }
    // Requires action
    if (status === "requires_action") {
        return { label: "Aktion erforderlich", Icon: Clock, iconBg: "bg-orange-50", iconColor: "text-orange-500", badgeBg: "bg-orange-50", badgeText: "text-orange-700" };
    }
    // Default
    return { label: "In Bearbeitung", Icon: PackageCheck, iconBg: "bg-sky-50", iconColor: "text-sky-500", badgeBg: "bg-sky-50", badgeText: "text-sky-700" };
}

function getProgressStep(status: string, fulfillmentStatus: string): number {
    if (status === "canceled") return -1;
    if (fulfillmentStatus === "shipped" || fulfillmentStatus === "delivered") return 3;
    if (fulfillmentStatus === "fulfilled" || fulfillmentStatus === "partially_shipped" || fulfillmentStatus === "partially_fulfilled") return 2;
    if (status === "completed" || status === "requires_action") return 1;
    return 0; // pending + not_fulfilled = just ordered
}

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
                                <Package className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                                <p className="text-slate-500 mb-4">Sie haben noch keine Bestellungen aufgegeben.</p>
                                <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#329ebf] text-white rounded-xl font-medium hover:bg-[#2889a6] transition-colors">
                                    Jetzt einkaufen
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order: any) => {
                                    const statusInfo = getOrderStatusInfo(order.status, order.fulfillment_status);
                                    const progressStep = getProgressStep(order.status, order.fulfillment_status);

                                    return (
                                        <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all duration-200">
                                            {/* Order Header */}
                                            <div className="p-5 pb-4">
                                                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
                                                    <div className="flex items-start gap-4">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${statusInfo.iconBg}`}>
                                                            <statusInfo.Icon className={`w-5 h-5 ${statusInfo.iconColor}`} />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2.5 mb-1">
                                                                <span className="font-bold text-lg text-slate-900">Bestellung #{order.display_id}</span>
                                                            </div>
                                                            <p className="text-sm text-slate-400">
                                                                {new Date(order.created_at).toLocaleDateString("de-DE", {
                                                                    day: "numeric", month: "long", year: "numeric"
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 sm:text-right">
                                                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusInfo.badgeBg} ${statusInfo.badgeText}`}>
                                                            {statusInfo.label}
                                                        </span>
                                                        <span className="font-bold text-xl text-slate-900 tabular-nums">
                                                            {((order.total || 0) / 100).toLocaleString("de-DE", { style: "currency", currency: order.currency_code?.toUpperCase() || "EUR" })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Progress Stepper */}
                                            <div className="px-5 pb-5">
                                                <div className="flex items-center gap-0">
                                                    {progressSteps.map((step, index) => {
                                                        const isActive = index <= progressStep;
                                                        const isCurrent = index === progressStep;
                                                        return (
                                                            <div key={step.key} className="flex items-center flex-1 last:flex-none">
                                                                <div className="flex flex-col items-center">
                                                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${isCurrent
                                                                        ? 'bg-[#329ebf] text-white ring-4 ring-[#329ebf]/20'
                                                                        : isActive
                                                                            ? 'bg-[#329ebf] text-white'
                                                                            : 'bg-slate-100 text-slate-400'
                                                                        }`}>
                                                                        {isActive && index < progressStep ? '✓' : index + 1}
                                                                    </div>
                                                                    <span className={`text-[10px] mt-1.5 font-medium whitespace-nowrap ${isCurrent ? 'text-[#329ebf]' : isActive ? 'text-slate-600' : 'text-slate-300'
                                                                        }`}>
                                                                        {step.label}
                                                                    </span>
                                                                </div>
                                                                {index < progressSteps.length - 1 && (
                                                                    <div className={`flex-1 h-0.5 mx-1.5 mt-[-14px] rounded-full ${index < progressStep ? 'bg-[#329ebf]' : 'bg-slate-100'
                                                                        }`} />
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
