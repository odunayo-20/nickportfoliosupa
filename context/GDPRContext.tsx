'use client';

import { createContext, useContext, useMemo, useState, useSyncExternalStore, ReactNode } from 'react';
import { logConsent } from '@/actions/gdpr';

interface GDPRConsent {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
}

interface GDPRContextType {
    consent: GDPRConsent | null;
    isPreferenceModalOpen: boolean;
    setPreferenceModalOpen: (open: boolean) => void;
    acceptAll: () => void;
    declineAll: () => void;
    savePreferences: (preferences: GDPRConsent) => void;
}

const GDPRContext = createContext<GDPRContextType | undefined>(undefined);

const STORAGE_KEY = 'gdpr_consent';
const FINGERPRINT_KEY = 'gdpr_fingerprint';
const CHANGE_EVENT = 'gdpr-consent-change';

// Stored consent as an external store: no setState-in-effect, and other tabs stay in sync.
const subscribeConsent = (cb: () => void) => {
    window.addEventListener('storage', cb);
    window.addEventListener(CHANGE_EVENT, cb);
    return () => {
        window.removeEventListener('storage', cb);
        window.removeEventListener(CHANGE_EVENT, cb);
    };
};
const readConsent = () => {
    try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
};

export const GDPRProvider = ({ children }: { children: ReactNode }) => {
    const stored = useSyncExternalStore(subscribeConsent, readConsent, () => null);
    const consent = useMemo<GDPRConsent | null>(() => {
        if (!stored) return null;
        try { return JSON.parse(stored) as GDPRConsent; } catch { return null; }
    }, [stored]);
    const [isPreferenceModalOpen, setPreferenceModalOpen] = useState(false);

    const getFingerprint = () => {
        let fingerprint = localStorage.getItem(FINGERPRINT_KEY);
        if (!fingerprint) {
            fingerprint = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);
            localStorage.setItem(FINGERPRINT_KEY, fingerprint);
        }
        return fingerprint;
    };

    const updateConsent = async (newConsent: GDPRConsent) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newConsent));
        window.dispatchEvent(new Event(CHANGE_EVENT));
        setPreferenceModalOpen(false);

        await logConsent({
            fingerprint: getFingerprint(),
            ...newConsent,
        });
    };

    const acceptAll = () => {
        updateConsent({ necessary: true, analytics: true, marketing: true });
    };

    const declineAll = () => {
        updateConsent({ necessary: true, analytics: false, marketing: false });
    };

    const savePreferences = (preferences: GDPRConsent) => {
        updateConsent(preferences);
    };

    return (
        <GDPRContext.Provider value={{
            consent,
            isPreferenceModalOpen,
            setPreferenceModalOpen,
            acceptAll,
            declineAll,
            savePreferences,
        }}>
            {children}
        </GDPRContext.Provider>
    );
};

export const useGDPR = () => {
    const context = useContext(GDPRContext);
    if (!context) {
        throw new Error('useGDPR must be used within a GDPRProvider');
    }
    return context;
};
