'use client'

import React from 'react'
import { Mail, MapPin } from 'lucide-react'
import Link from 'next/link'
import { NewsletterForm } from '@/components/NewsletterForm'
import { LinkedinIcon, GithubIcon, TwitterIcon } from '@/components/Icons'
import { myAppHook } from '@/context/AppUtils'


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
                                <span className="font-medium">nikola.srdoc@gmail.com</span>
                                {/* <span className="font-medium">hello@{siteSettings?.site_title?.toLowerCase().replace(/\s+/g, '') || 'nikola'}.dev</span> */}
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                <MapPin className="w-4 h-4 text-brand-orange" />
                            </div>
                            <div>
                                <span className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Location</span>
                                <span className="font-medium">Zadar, Croatia</span>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="lg:col-span-4">
                    <NewsletterForm />
                </div>

            </div>

            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-medium">
               <p>
  © {new Date().getFullYear()} {siteSettings?.site_title || 'Nikola Portfolio'}. All Rights Reserved.
</p>
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