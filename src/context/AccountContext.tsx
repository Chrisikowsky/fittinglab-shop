"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { sdk } from "@/lib/medusa";
import { useRouter } from "next/navigation";

interface AccountContextType {
    customer: any | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshCustomer: () => Promise<void>;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export function AccountProvider({ children }: { children: ReactNode }) {
    const [customer, setCustomer] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchCustomer = async () => {
        try {
            // Medusa V2: Retrieve "me"
            const { customer } = await sdk.store.customer.retrieve("me", {
                fields: "+email,+first_name,+last_name,+orders.id,+orders.display_id,+orders.total,+orders.created_at,+orders.status,+orders.fulfillment_status,+orders.payment_status"
            });
            setCustomer(customer);
        } catch (e) {
            console.error("fetchCustomer failed:", e);
            // Not logged in or error
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
            // WORKAROUND: SDK V2 Auth types are strict/missing 'authenticate'.
            // Use direct fetch to /auth/customer/emailpass (Standard V2 Login for EmailPass)
            const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

            const response = await fetch(`${baseUrl}/auth/customer/emailpass`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
                },
                credentials: "include",
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Login fehlgeschlagen");
            }

            // After login, session is set cookie-wise.
            await fetchCustomer();

            // Check if customer is set (need to access state or just check logic)
            // Since fetchCustomer updates state, we can't check 'customer' immediately here due to closure.
            // But we can check if we want to redirect.
            router.push("/account");
        } catch (e: any) {
            console.error("Login failed", e);
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            // WORKAROUND: SDK V2 'signout' might be missing or different
            // DELETE /auth/session is standard
            const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
            await fetch(`${baseUrl}/auth/session`, {
                method: "DELETE",
                headers: {
                    "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
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
