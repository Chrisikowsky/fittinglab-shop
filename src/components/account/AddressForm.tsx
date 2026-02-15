"use client";

import { useState } from "react";
import { Loader2, Save, X } from "lucide-react";

const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

interface Address {
    id?: string;
    company?: string;
    first_name: string;
    last_name: string;
    address_1: string;
    address_2?: string;
    postal_code: string;
    city: string;
    country_code: string;
    phone?: string;
    metadata?: { tax_id?: string };
}

interface AddressFormProps {
    address?: Address | null;
    customerName?: { first_name: string; last_name: string };
    onSaved: () => void;
    onCancel: () => void;
}

export default function AddressForm({ address, customerName, onSaved, onCancel }: AddressFormProps) {
    const [form, setForm] = useState<Address>({
        company: address?.company || "",
        first_name: address?.first_name || customerName?.first_name || "",
        last_name: address?.last_name || customerName?.last_name || "",
        address_1: address?.address_1 || "",
        address_2: address?.address_2 || "",
        postal_code: address?.postal_code || "",
        city: address?.city || "",
        country_code: address?.country_code || "de",
        phone: address?.phone || "",
        metadata: { tax_id: address?.metadata?.tax_id || "" },
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (field: string, value: string) => {
        if (field === "tax_id") {
            setForm(prev => ({ ...prev, metadata: { ...prev.metadata, tax_id: value } }));
        } else {
            setForm(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const isUpdate = !!address?.id;
            const url = isUpdate
                ? `${baseUrl}/store/customers/me/addresses/${address!.id}`
                : `${baseUrl}/store/customers/me/addresses`;

            const res = await fetch(url, {
                method: isUpdate ? "POST" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-publishable-api-key": publishableKey,
                },
                credentials: "include",
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Adresse konnte nicht gespeichert werden.");
            }

            onSaved();
        } catch (e: any) {
            console.error("Address save failed:", e);
            setError(e.message || "Fehler beim Speichern.");
        } finally {
            setSaving(false);
        }
    };

    const inputClass = "mt-1 block w-full px-3 py-2 text-sm border border-slate-300 rounded-lg shadow-sm focus:ring-[#329ebf] focus:border-[#329ebf] transition-colors";
    const labelClass = "block text-xs font-semibold text-slate-600 uppercase tracking-wider";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Company */}
            <div>
                <label className={labelClass}>Firma</label>
                <input type="text" value={form.company} onChange={e => handleChange("company", e.target.value)} className={inputClass} placeholder="Optional" />
            </div>

            {/* Name Row */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className={labelClass}>Vorname</label>
                    <input type="text" required value={form.first_name} onChange={e => handleChange("first_name", e.target.value)} className={inputClass} />
                </div>
                <div>
                    <label className={labelClass}>Nachname</label>
                    <input type="text" required value={form.last_name} onChange={e => handleChange("last_name", e.target.value)} className={inputClass} />
                </div>
            </div>

            {/* Street */}
            <div>
                <label className={labelClass}>Straße + Hausnummer</label>
                <input type="text" required value={form.address_1} onChange={e => handleChange("address_1", e.target.value)} className={inputClass} />
            </div>

            {/* Address supplement */}
            <div>
                <label className={labelClass}>Adresszusatz</label>
                <input type="text" value={form.address_2} onChange={e => handleChange("address_2", e.target.value)} className={inputClass} placeholder="Optional" />
            </div>

            {/* PLZ + City Row */}
            <div className="grid grid-cols-3 gap-3">
                <div>
                    <label className={labelClass}>PLZ</label>
                    <input type="text" required value={form.postal_code} onChange={e => handleChange("postal_code", e.target.value)} className={inputClass} />
                </div>
                <div className="col-span-2">
                    <label className={labelClass}>Stadt</label>
                    <input type="text" required value={form.city} onChange={e => handleChange("city", e.target.value)} className={inputClass} />
                </div>
            </div>

            {/* Country */}
            <div>
                <label className={labelClass}>Land</label>
                <select value={form.country_code} onChange={e => handleChange("country_code", e.target.value)} className={inputClass}>
                    <option value="de">Deutschland</option>
                    <option value="at">Österreich</option>
                    <option value="ch">Schweiz</option>
                </select>
            </div>

            {/* Phone */}
            <div>
                <label className={labelClass}>Telefon</label>
                <input type="tel" value={form.phone} onChange={e => handleChange("phone", e.target.value)} className={inputClass} placeholder="Optional" />
            </div>

            {/* Tax ID */}
            <div>
                <label className={labelClass}>Steueridentifikationsnummer</label>
                <input type="text" value={form.metadata?.tax_id || ""} onChange={e => handleChange("tax_id", e.target.value)} className={inputClass} placeholder="z.B. DE123456789" />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#329ebf] text-white text-sm font-medium rounded-lg hover:bg-[#288aa8] disabled:opacity-50 transition-colors"
                >
                    {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                    Speichern
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-slate-600 text-sm font-medium rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
                >
                    <X className="w-4 h-4" />
                    Abbrechen
                </button>
            </div>
        </form>
    );
}
