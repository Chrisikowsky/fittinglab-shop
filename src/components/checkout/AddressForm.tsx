"use client";

import { useState } from "react";
import { sdk } from "@/lib/medusa";

interface AddressFormProps {
    cart: any;
    onSuccess: (updatedCart: any) => void;
}

export function AddressForm({ cart, onSuccess }: AddressFormProps) {
    const [email, setEmail] = useState(cart?.email || "");
    const [firstName, setFirstName] = useState(cart?.shipping_address?.first_name || "");
    const [lastName, setLastName] = useState(cart?.shipping_address?.last_name || "");
    const [address1, setAddress1] = useState(cart?.shipping_address?.address_1 || "");
    const [address2, setAddress2] = useState(cart?.shipping_address?.address_2 || "");
    const [city, setCity] = useState(cart?.shipping_address?.city || "");
    const [postalCode, setPostalCode] = useState(cart?.shipping_address?.postal_code || "");
    const [phone, setPhone] = useState(cart?.shipping_address?.phone || "");
    // Default to DE for now, can be select later
    const [countryCode, setCountryCode] = useState(cart?.shipping_address?.country_code || "de");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Update email on cart
            await sdk.store.cart.update(cart.id, { email });

            // Create address object
            const address = {
                first_name: firstName,
                last_name: lastName,
                address_1: address1, // Fixed: API expects address_1 (snake_case) or address1? Medusa V2 usually camelCase? 
                // Wait, SDK usually takes camel case but APIsnake? Let's check docs or try.
                // Standard Medusa Store API payload:
                // shipping_address: { first_name, last_name, address_1, ... }
                // Let's rely on correct typing if possible, or standard JSON structure.
                address_2: address2,
                city,
                postal_code: postalCode,
                phone,
                country_code: countryCode,
                company: "",
                province: ""
            };

            // Update shipping address
            const { cart: updatedCart } = await sdk.store.cart.update(cart.id, {
                shipping_address: address,
                billing_address: address, // For now, sync them
            });

            onSuccess(updatedCart);

        } catch (e: any) {
            console.error("Error updating address:", e);
            setError(e.message || "Ein Fehler ist aufgetreten.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h3 className="text-xl font-bold mb-4 text-[#329ebf]">1. Kontakt & Adresse</h3>

                {/* Email */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">E-Mail Adresse</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#329ebf] focus:border-transparent"
                        placeholder="ihre@email.de"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Vorname</label>
                        <input
                            type="text"
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#329ebf] focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nachname</label>
                        <input
                            type="text"
                            required
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#329ebf] focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Straße & Hausnummer</label>
                    <input
                        type="text"
                        required
                        value={address1}
                        onChange={(e) => setAddress1(e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#329ebf] focus:border-transparent"
                    />
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Adresszusatz (optional)</label>
                    <input
                        type="text"
                        value={address2}
                        onChange={(e) => setAddress2(e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#329ebf] focus:border-transparent"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">PLZ</label>
                        <input
                            type="text"
                            required
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#329ebf] focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Stadt</label>
                        <input
                            type="text"
                            required
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#329ebf] focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Land Code (z.B. de)</label>
                    <input
                        type="text"
                        required
                        maxLength={2}
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value.toLowerCase())}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#329ebf] focus:border-transparent uppercase"
                    />
                </div>

                <div className="mt-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Telefon (für Rückfragen)</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#329ebf] focus:border-transparent"
                    />
                </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#329ebf] hover:bg-[#288aa8] text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "Wird gespeichert..." : "Weiter zum Versand"}
            </button>
        </form>
    );
}
