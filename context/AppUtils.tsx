'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { User, Session } from "@supabase/supabase-js";

interface AppUtilsType {
    isLoggedIn: boolean;
    user: User | null;
    session: Session | null;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    setAuthToken: (id: string | null) => void;
    isLoading: boolean;
}

const AppUtilsContext = createContext<AppUtilsType | undefined>(undefined);

export const AppUtilsProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Initial session check
        const initAuth = async () => {
            try {
                console.log("Initializing auth...");
                const { data: { session } } = await supabase.auth.getSession();
                console.log("Session fetched:", !!session);
                setSession(session);
                setUser(session?.user ?? null);
                setIsLoggedIn(!!session);
            } catch (error) {
                console.error("Error initializing auth:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const authSubscription = supabase.auth.onAuthStateChange((_event, session) => {
            console.log("Auth state change:", _event, !!session);
            setSession(session);
            setUser(session?.user ?? null);
            setIsLoggedIn(!!session);
            setIsLoading(false);
        });

        initAuth();

        // Safety timeout to prevent infinite loading
        const safetyRetry = setTimeout(() => {
            setIsLoading(false);
            console.log("Auth safety timeout reached.");
        }, 5000);

        return () => {
            clearTimeout(safetyRetry);
            if (authSubscription && authSubscription.data && authSubscription.data.subscription) {
                authSubscription.data.subscription.unsubscribe();
            }
        };
    }, []);

    const setAuthToken = (id: string | null) => {
        // Compatibility with existing code if needed
    };

    return (
        <AppUtilsContext.Provider value={{ 
            isLoggedIn, 
            user, 
            session, 
            setIsLoggedIn, 
            setAuthToken,
            isLoading 
        }}>
            {children}
        </AppUtilsContext.Provider>
    );
};

export const myAppHook = () => {
    const context = useContext(AppUtilsContext);
    if (!context) {
        throw new Error("myAppHook must be used within an AppUtilsProvider");
    }
    return context;
};
