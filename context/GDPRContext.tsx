'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

export const GDPRProvider = ({ children }: { children: ReactNode }) => {
    const [consent, setConsent] = useState<GDPRConsent | null>(null);
    const [isPreferenceModalOpen, setPreferenceModalOpen] = useState(false);

    useEffect(() => {
        const storedConsent = localStorage.getItem(STORAGE_KEY);
        if (storedConsent) {
            setConsent(JSON.parse(storedConsent));
        }
    }, []);

    const getFingerprint = () => {
        let fingerprint = localStorage.getItem(FINGERPRINT_KEY);
        if (!fingerprint) {
            fingerprint = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);
            localStorage.setItem(FINGERPRINT_KEY, fingerprint);
        }
        return fingerprint;
    };

    const updateConsent = async (newConsent: GDPRConsent) => {
        setConsent(newConsent);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newConsent));
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
