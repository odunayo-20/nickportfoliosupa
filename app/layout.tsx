import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AppUtilsProvider } from "@/context/AppUtils";
import { GDPRProvider } from "@/context/GDPRContext";
import GDPRBanner from "@/components/GDPRBanner";
import VisitorTracker from "@/components/VisitorTracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { getSettings } from "@/actions/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  
  return {
    title: settings?.site_title || "Architect — Portfolio Manager",
    description: settings?.meta_description || "Manage your portfolio, blog, and professional presence.",
    keywords: settings?.keywords || [],
    icons: {
      icon: settings?.logo || "/logo.png",
      apple: settings?.logo || "/logo.png",
    },
    openGraph: {
      images: settings?.og_image_url ? [settings.og_image_url] : ["/logo.png"],
      title: settings?.site_title || "Architect Portfolio",
      description: settings?.meta_description || "Manage your professional presence.",
    },
  };

}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col tracking-tight bg-background text-foreground">
        <AppUtilsProvider>
          <GDPRProvider>
            {children}
            <GDPRBanner />
            <VisitorTracker />
          </GDPRProvider>
        </AppUtilsProvider>
        <Toaster />
      </body>
    </html>
  );
}
