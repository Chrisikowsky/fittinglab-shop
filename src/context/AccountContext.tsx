"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AccountContextType {
    customer: any | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshCustomer: () => Promise<void>;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

export function AccountProvider({ children }: { children: ReactNode }) {
    const [customer, setCustomer] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchCustomer = async () => {
        try {
            const res = await fetch(`${baseUrl}/store/customers/me?fields=+addresses,+orders`, {
                method: "GET",
                headers: {
                    "x-publishable-api-key": publishableKey,
                },
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error("Not authenticated");
            }

            const data = await res.json();
            setCustomer(data.customer);
        } catch (e) {
            console.error("fetchCustomer failed:", e);
            setCustomer(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomer();
    }, []);

    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            // Step 1: Authenticate → get JWT token
            console.log("[Login] Step 1: Authenticating...");
            const authRes = await fetch(`${baseUrl}/auth/customer/emailpass`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-publishable-api-key": publishableKey,
                },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });

            if (!authRes.ok) {
                const data = await authRes.json();
                console.error("[Login] Step 1 FAILED:", authRes.status, data);
                throw new Error(data.message || "Login fehlgeschlagen");
            }

            const authData = await authRes.json();
            console.log("[Login] Step 1 OK, response:", JSON.stringify(authData));
            const token = authData.token;

            if (!token) {
                console.error("[Login] No token in auth response!");
                throw new Error("Kein Token erhalten");
            }

            // Step 2: Create session cookie using the JWT token
            console.log("[Login] Step 2: Creating session...");
            const sessionRes = await fetch(`${baseUrl}/auth/session`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "x-publishable-api-key": publishableKey,
                },
                credentials: "include",
            });

            console.log("[Login] Step 2 status:", sessionRes.status);

            if (!sessionRes.ok) {
                const sessData = await sessionRes.json().catch(() => ({}));
                console.error("[Login] Step 2 FAILED:", sessionRes.status, sessData);
                throw new Error("Session konnte nicht erstellt werden");
            }

            // Step 3: Now fetch customer data (session cookie is set)
            console.log("[Login] Step 3: Fetching customer...");
            await fetchCustomer();
            console.log("[Login] Complete! Redirecting to /account");
            router.push("/account");
        } catch (e: any) {
            console.error("[Login] FAILED:", e);
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await fetch(`${baseUrl}/auth/session`, {
                method: "DELETE",
                headers: {
                    "x-publishable-api-key": publishableKey,
                },
                credentials: "include",
            });

            setCustomer(null);
            router.push("/");
        } catch (e) {
            console.error("Logout failed", e);
        }
    };

    return (
        <AccountContext.Provider value={{ customer, loading, login, logout, refreshCustomer: fetchCustomer }}>
            {children}
        </AccountContext.Provider>
    );
}

export function useAccount() {
    const context = useContext(AccountContext);
    if (context === undefined) {
        throw new Error("useAccount must be used within an AccountProvider");
    }
    return context;
}
