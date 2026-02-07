"use client";

import { useEffect } from "react";
import { useAccount } from "@/context/AccountContext";
import { useRouter } from "next/navigation";
import { Loader2, Package, LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";

export default function AccountPage() {
    const { customer, loading, logout } = useAccount();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !customer) {
            router.push("/account/login");
        }
    }, [customer, loading, router]);

    if (loading || !customer) {
        return <div className="min-h-screen flex justify-center items-center"><Loader2 className="animate-spin text-[#329ebf] w-8 h-8" /></div>;
    }

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
                    {/* Profile Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
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

                    {/* Orders List */}
                    <div className="md:col-span-2 space-y-6">
                        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Package className="w-5 h-5 text-slate-400" />
                            Bestellhistorie
                        </h2>

                        {(!customer.orders || customer.orders.length === 0) ? (
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
                                <p className="text-slate-500 mb-4">Sie haben noch keine Bestellungen aufgegeben.</p>
                                <Link href="/" className="text-[#329ebf] font-medium hover:underline">
                                    Jetzt einkaufen gehen
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {customer.orders.map((order: any) => (
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
                                            {/* Link to details if we had a detail page */}
                                            {/* <ArrowRight className="w-4 h-4 text-slate-300" /> */}
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
