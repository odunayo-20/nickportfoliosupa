'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { User, Session } from "@supabase/supabase-js";

interface SiteSettings {
    site_title: string;
    site_tagline: string;
    meta_description?: string;
    logo?: string;
    accent_color?: string;
    og_image_url?: string;
}


interface AppUtilsType {
    isLoggedIn: boolean;
    user: User | null;
    session: Session | null;
    siteSettings: SiteSettings | null;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    setAuthToken: (id: string | null) => void;
    isLoading: boolean;
    refreshSettings: () => Promise<void>;
}

const AppUtilsContext = createContext<AppUtilsType | undefined>(undefined);

export const AppUtilsProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshSettings = async () => {
        try {
            const { data } = await supabase.from("settings").select("*").limit(1).maybeSingle();
            if (data) {
                setSiteSettings(data);
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
        }
    };

    useEffect(() => {
        // Initial session check
        const initAuth = async () => {
            try {
                console.log("Initializing auth...");
                const { data: { session } } = await supabase.auth.getSession();
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
            setSession(session);
            setUser(session?.user ?? null);
            setIsLoggedIn(!!session);
            setIsLoading(false);
        });

        initAuth();
        refreshSettings();

        // Safety timeout to prevent infinite loading
        const safetyRetry = setTimeout(() => {
            setIsLoading(false);
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
            siteSettings,
            setIsLoggedIn, 
            setAuthToken,
            isLoading,
            refreshSettings
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
