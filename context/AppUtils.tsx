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

interface Profile {
    name: string | null;
    title: string | null;
    bio: string | null;
    avatar_url: string | null;
    resume_url: string | null;
    social_links: any;
    email: string | null;
}


interface AppUtilsType {
    isLoggedIn: boolean;
    user: User | null;
    session: Session | null;
    siteSettings: SiteSettings | null;
    profile: Profile | null;
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
    const [profile, setProfile] = useState<Profile | null>(null);
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

    const refreshProfile = async () => {
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("name, title, bio, avatar_url, resume_url, social_links")
                .limit(1)
                .maybeSingle();
            
            const { data: { user } } = await supabase.auth.getUser();

            if (data) {
                const profileData = { ...data, email: user?.email || null } as Profile;
                // Handle resume_url fallback and formatting as in the server action
                if (!profileData.resume_url && profileData.social_links?.resume_url) {
                    profileData.resume_url = profileData.social_links.resume_url;
                }
                
                if (profileData.resume_url && !profileData.resume_url.includes("download=")) {
                    const separator = profileData.resume_url.includes("?") ? "&" : "?";
                    profileData.resume_url = `${profileData.resume_url}${separator}download=`;
                }
                
                setProfile(profileData);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
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
        refreshProfile();

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
            profile,
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
