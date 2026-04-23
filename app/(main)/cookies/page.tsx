import React from 'react';

const CookiePolicy = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 py-24">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-brand-dark mb-8">Cookie Policy</h1>
            <div className="prose prose-lg max-w-none text-brand-muted">
                <p className="mb-6">Effective Date: April 23, 2026</p>
                
                <h2 className="text-2xl font-bold text-brand-dark mt-12 mb-4">What are cookies?</h2>
                <p>Cookies are small text files that are used to store small pieces of information. They are stored on your device when the website is loaded on your browser. These cookies help us make the website function properly, make it more secure, and provide a better user experience.</p>
                
                <h2 className="text-2xl font-bold text-brand-dark mt-12 mb-4">How do we use cookies?</h2>
                <p>As most of the online services, our website uses first-party and third-party cookies for several purposes. First-party cookies are mostly necessary for the website to function the right way. Third-party cookies are used for understanding how the website performs, how you interact with our website, keeping our services secure, and providing you with a better user experience.</p>

                <h2 className="text-2xl font-bold text-brand-dark mt-12 mb-4">Types of cookies we use</h2>
                <div className="grid gap-6 mt-6">
                    <div className="p-6 bg-gray-50 rounded-2xl">
                        <h3 className="font-bold text-brand-dark mb-2">Necessary</h3>
                        <p className="text-sm">Some cookies are essential for you to be able to experience the full functionality of our site. They allow us to maintain user sessions and prevent any security threats. They do not collect or store any personal information.</p>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-2xl">
                        <h3 className="font-bold text-brand-dark mb-2">Analytics</h3>
                        <p className="text-sm">These cookies store information like the number of visitors to the website, the number of unique visitors, which pages of the website have been visited, the source of the visit, etc. This data helps us understand and analyze how well the website performs.</p>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-2xl">
                        <h3 className="font-bold text-brand-dark mb-2">Marketing</h3>
                        <p className="text-sm">Our website may display advertisements. These cookies are used to personalize the advertisements that we show to you so that they are meaningful to you. These cookies also help us keep track of the efficiency of these ad campaigns.</p>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-brand-dark mt-12 mb-4">Managing cookie preferences</h2>
                <p>You can change your cookie preferences any time by clicking the "Cookie Preferences" link in the footer of our website. This will let you revisit the consent banner and change your preferences or withdraw your consent right away.</p>
            </div>
        </div>
    );
};

export default CookiePolicy;
