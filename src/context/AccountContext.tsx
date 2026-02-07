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
            // Medusa V2 Auth: Email/Pass provider
            await sdk.auth.authenticate("emailpass", {
                email,
                password,
            });
            await fetchCustomer();
            router.push("/account");
        } catch (e: any) {
            console.error("Login failed", e);
            throw e; // Let component handle error display
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await sdk.auth.signout(); // or sdk.auth.deleteSession() check SDK
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
