'use client'

import React from 'react'
import { Mail, MapPin } from 'lucide-react'
import Link from 'next/link'
import { NewsletterForm } from '@/components/NewsletterForm'
import { myAppHook } from '@/context/AppUtils'

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect width="4" height="12" x="2" y="9"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
)

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path>
  </svg>
)

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5 2.8 12.5 3 11c-1.2.6-2.5.5-3.5-.5 1-1.3 2.8-1.5 4-1.5-1-1.5-1.5-3.5-.5-5 1.5 2 3.5 3.5 6 4-.5-3.5 4-5.5 6.5-3 1.5-.5 3-1.5 4-2.5-1 1.5-2.5 3-4 3.5z"></path>
  </svg>
)

const Footer = () => {
  const { siteSettings } = myAppHook()

  return (
    <>
     <footer className="bg-[#1e3628] text-white pt-20 pb-10 border-t-8 border-brand-orange">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
                
                <div className="lg:col-span-3">
                    <div className="flex items-center gap-2 mb-6 cursor-pointer">
                        <div className="w-8 h-8 bg-brand-orange rounded-full flex items-center justify-center text-brand-dark font-bold italic overflow-hidden">
                            {siteSettings?.logo ? (
                                <img src={siteSettings.logo} alt="Logo" className="w-full h-full object-cover" />
                            ) : (
                                siteSettings?.site_title?.[0] || 'N'
                            )}
                        </div>

                        <span className="text-xl font-extrabold tracking-tighter text-white">
                            {siteSettings?.site_title || 'Nikola'}.
                        </span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                        {siteSettings?.meta_description || 'Senior App Developer based in Nigeria, specializing in high-performance native architectures and robust web systems.'}
                    </p>
                    <div className="flex gap-3">
                        <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-orange hover:text-brand-dark transition-all">
                            <LinkedinIcon className="w-4 h-4" />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-orange hover:text-brand-dark transition-all">
                            <GithubIcon className="w-4 h-4" />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-orange hover:text-brand-dark transition-all">
                            <TwitterIcon className="w-4 h-4" />
                        </a>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <h4 className="text-white font-bold mb-6 text-lg tracking-tight">Navigation</h4>
                    <ul className="space-y-4 text-sm font-medium text-gray-400">
                        <li><Link href="/" className="hover:text-brand-orange transition-colors">Home</Link></li>
                        <li><Link href="/services" className="hover:text-brand-orange transition-colors">Services</Link></li>
                        <li><Link href="/about" className="hover:text-brand-orange transition-colors">About Me</Link></li>
                        <li><Link href="/projects" className="hover:text-brand-orange transition-colors">Featured Projects</Link></li>
                        <li><Link href="/blog" className="hover:text-brand-orange transition-colors">Blog</Link></li>
                    </ul>
                </div>

                <div className="lg:col-span-3">
                    <h4 className="text-white font-bold mb-6 text-lg tracking-tight">Contact</h4>
                    <ul className="space-y-6 text-sm">
                        <li className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                <Mail className="w-4 h-4 text-brand-orange" />
                            </div>
                            <div>
                                <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Email Me</span>
                                <span className="font-medium">hello@{siteSettings?.site_title?.toLowerCase().replace(/\s+/g, '') || 'nikola'}.dev</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                <MapPin className="w-4 h-4 text-brand-orange" />
                            </div>
                            <div>
                                <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Location</span>
                                <span className="font-medium">Lagos, Nigeria</span>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="lg:col-span-4">
                    <NewsletterForm />
                </div>

            </div>

            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-medium">
                <p>© 2026 {siteSettings?.site_title || 'Nikola Portfolio'}. All Rights Reserved.</p>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                </div>
            </div>
        </div>
    </footer>

    </>
  )
}

export default Footer