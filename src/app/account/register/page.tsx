"use client";

import { useState } from "react";
import Link from "next/link";
import { useAccount } from "@/context/AccountContext";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const { login } = useAccount();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
        const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

        try {
            // ── Step 1: Register auth identity → get JWT token ──
            const authRes = await fetch(`${baseUrl}/auth/customer/emailpass/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-publishable-api-key": publishableKey,
                },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });

            if (!authRes.ok) {
                const authData = await authRes.json();
                // Handle "identity already exists"
                if (authRes.status === 400 || authRes.status === 409) {
                    throw new Error("Ein Benutzer mit dieser E-Mail-Adresse existiert bereits.");
                }
                throw new Error(authData.message || "Registrierung fehlgeschlagen (Auth).");
            }

            const { token } = await authRes.json();

            // ── Step 2: Create customer profile using the JWT token ──
            const customerRes = await fetch(`${baseUrl}/store/customers`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "x-publishable-api-key": publishableKey,
                },
                credentials: "include",
                body: JSON.stringify({
                    email,
                    first_name: firstName,
                    last_name: lastName,
                }),
            });

            if (!customerRes.ok) {
                const custData = await customerRes.json();
                throw new Error(custData.message || "Kundenprofil konnte nicht erstellt werden.");
            }

            // ── Step 3: Log in to establish session ──
            await login(email, password);

        } catch (e: any) {
            console.error("Registrierung fehlgeschlagen:", e);
            setError(e.message || "Registrierung fehlgeschlagen.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
                    Konto erstellen
                </h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Bereits registriert?{" "}
                    <Link href="/account/login" className="font-medium text-[#329ebf] hover:text-[#288aa8]">
                        Hier anmelden
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Vorname</label>
                                <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-[#329ebf] focus:border-[#329ebf]" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Nachname</label>
                                <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-[#329ebf] focus:border-[#329ebf]" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">E-Mail Adresse</label>
                            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-[#329ebf] focus:border-[#329ebf]" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Passwort</label>
                            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-[#329ebf] focus:border-[#329ebf]" />
                        </div>

                        {error && <div className="text-red-500 text-sm">{error}</div>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#329ebf] hover:bg-[#288aa8] disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Registrieren"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
