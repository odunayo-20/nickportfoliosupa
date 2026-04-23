'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGDPR } from '@/context/GDPRContext';
import { X, Shield, Settings, Check } from 'lucide-react';
import Link from 'next/link';

const GDPRBanner = () => {
    const { 
        consent, 
        acceptAll, 
        declineAll, 
        savePreferences,
        isPreferenceModalOpen,
        setPreferenceModalOpen
    } = useGDPR();

    const [tempPreferences, setTempPreferences] = useState({
        necessary: true,
        analytics: false,
        marketing: false
    });

    // Don't show if consent is already given
    if (consent) return null;

    return (
        <>
            {/* Banner */}
            <AnimatePresence>
                {!isPreferenceModalOpen && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-6 left-6 right-6 z-50 md:max-w-2xl md:left-auto"
                    >
                        <div className="bg-brand-dark border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-brand-orange/20 flex items-center justify-center shrink-0">
                                    <Shield className="w-5 h-5 text-brand-orange" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-bold mb-2">We value your privacy</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                        We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. <Link href="/privacy" className="text-brand-orange hover:underline">Read more</Link>
                                    </p>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <button 
                                            onClick={acceptAll}
                                            className="px-6 py-2 bg-brand-orange text-brand-dark font-bold text-sm rounded-full hover:bg-brand-light transition-colors"
                                        >
                                            Accept All
                                        </button>
                                        <button 
                                            onClick={declineAll}
                                            className="px-6 py-2 bg-white/10 text-white font-bold text-sm rounded-full hover:bg-white/20 transition-colors"
                                        >
                                            Reject All
                                        </button>
                                        <button 
                                            onClick={() => setPreferenceModalOpen(true)}
                                            className="px-4 py-2 text-gray-400 font-medium text-sm hover:text-white transition-colors flex items-center gap-2"
                                        >
                                            <Settings className="w-4 h-4" /> Customize
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Preference Modal Overlay */}
            <AnimatePresence>
                {isPreferenceModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setPreferenceModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
                        >
                            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-brand-dark flex items-center gap-2">
                                    <Settings className="w-5 h-5 text-brand-orange" /> Cookie Preferences
                                </h3>
                                <button onClick={() => setPreferenceModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <div className="p-8 space-y-6">
                                {/* Necessary */}
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-brand-dark mb-1">Strictly Necessary Cookies</h4>
                                        <p className="text-sm text-brand-muted">Essential for the website to function properly. Cannot be disabled.</p>
                                    </div>
                                    <div className="w-12 h-6 bg-brand-green/20 rounded-full flex items-center justify-end px-1 opacity-50 cursor-not-allowed">
                                        <div className="w-4 h-4 bg-brand-green rounded-full shadow-sm" />
                                    </div>
                                </div>

                                {/* Analytics */}
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-brand-dark mb-1">Analytics Cookies</h4>
                                        <p className="text-sm text-brand-muted">Allow us to count visits and traffic sources so we can measure and improve performance.</p>
                                    </div>
                                    <button 
                                        onClick={() => setTempPreferences(prev => ({ ...prev, analytics: !prev.analytics }))}
                                        className={`w-12 h-6 rounded-full flex items-center transition-all duration-300 px-1 ${tempPreferences.analytics ? 'bg-brand-green justify-end' : 'bg-gray-200 justify-start'}`}
                                    >
                                        <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                                    </button>
                                </div>

                                {/* Marketing */}
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-brand-dark mb-1">Marketing Cookies</h4>
                                        <p className="text-sm text-brand-muted">Used to track visitors across websites to display relevant and engaging ads.</p>
                                    </div>
                                    <button 
                                        onClick={() => setTempPreferences(prev => ({ ...prev, marketing: !prev.marketing }))}
                                        className={`w-12 h-6 rounded-full flex items-center transition-all duration-300 px-1 ${tempPreferences.marketing ? 'bg-brand-green justify-end' : 'bg-gray-200 justify-start'}`}
                                    >
                                        <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-8 bg-gray-50 flex flex-col md:flex-row gap-4">
                                <button 
                                    onClick={() => savePreferences(tempPreferences)}
                                    className="flex-1 py-3 bg-brand-dark text-white font-bold rounded-xl hover:bg-brand-orange hover:text-brand-dark transition-all"
                                >
                                    Save My Preferences
                                </button>
                                <button 
                                    onClick={acceptAll}
                                    className="flex-1 py-3 bg-brand-orange text-brand-dark font-bold rounded-xl hover:bg-brand-dark hover:text-white transition-all flex items-center justify-center gap-2"
                                >
                                    <Check className="w-4 h-4" /> Accept All
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default GDPRBanner;
