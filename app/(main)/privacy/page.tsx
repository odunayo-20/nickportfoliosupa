import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 py-24">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-brand-dark mb-8">Privacy Policy</h1>
            <div className="prose prose-lg max-w-none text-brand-muted">
                <p className="mb-6">Effective Date: April 23, 2026</p>
                
                <h2 className="text-2xl font-bold text-brand-dark mt-12 mb-4">1. Introduction</h2>
                <p>Welcome to our portfolio. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website.</p>
                
                <h2 className="text-2xl font-bold text-brand-dark mt-12 mb-4">2. The Data We Collect</h2>
                <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Identity Data</strong> includes first name, last name.</li>
                    <li><strong>Contact Data</strong> includes email address.</li>
                    <li><strong>Technical Data</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location.</li>
                </ul>

                <h2 className="text-2xl font-bold text-brand-dark mt-12 mb-4">3. GDPR Compliance</h2>
                <p>In compliance with the General Data Protection Regulation (GDPR) for our users in the European Economic Area (EEA), including Croatia:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>We process data only when we have a legal basis.</li>
                    <li>You have the right to access, rectify, or erase your personal data.</li>
                    <li>You have the right to object to processing and the right to data portability.</li>
                </ul>

                <h2 className="text-2xl font-bold text-brand-dark mt-12 mb-4">4. Contact Us</h2>
                <p>If you have any questions about this privacy policy or our privacy practices, please contact us at hello@nikola.dev.</p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
