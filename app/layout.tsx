import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AppUtilsProvider } from "@/context/AppUtils";
import { GDPRProvider } from "@/context/GDPRContext";
import GDPRBanner from "@/components/GDPRBanner";
import VisitorTracker from "@/components/VisitorTracker";
import JsonLd from "@/components/JsonLd";
import { getSettings } from "@/actions/settings";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  const title = settings?.site_title || "Nikola Srdoc — Portfolio";
  const description =
    settings?.meta_description ||
    "Nikola Srdoc's portfolio — projects, blog, and professional services.";
  const ogImage = settings?.og_image_url
    ? [settings.og_image_url]
    : [`${BASE_URL}/logo.png`];

  return {
    metadataBase: new URL(BASE_URL),

    // ── Core ─────────────────────────────────────────────────────────────────
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    keywords: settings?.keywords || [],

    // ── Canonical ─────────────────────────────────────────────────────────────
    alternates: {
      canonical: BASE_URL,
    },

    // ── Icons ─────────────────────────────────────────────────────────────────
    icons: {
      icon: settings?.logo || "/logo.png",
      apple: settings?.logo || "/logo.png",
      shortcut: settings?.logo || "/logo.png",
    },

    // ── Open Graph ────────────────────────────────────────────────────────────
    openGraph: {
      type: "website",
      locale: "en_US",
      url: BASE_URL,
      siteName: title,
      title,
      description,
      images: ogImage.map((img) => ({
        url: img,
        width: 1200,
        height: 630,
        alt: title,
      })),
    },

    // ── Twitter / X Card ──────────────────────────────────────────────────────
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage,
    },

    // ── Indexing hints ────────────────────────────────────────────────────────
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  const personName = settings?.site_title || "Nikola Srdoc";
  const personDescription =
    settings?.meta_description ||
    "Portfolio site showcasing projects, blog posts, and professional services.";

  // Schema.org Person structured data — helps Google understand who this site belongs to
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: personName,
    url: BASE_URL,
    description: personDescription,
    image: `${BASE_URL}/nikola.jpeg`,
    sameAs: [] as string[], // Add social profile URLs here if available e.g. LinkedIn, GitHub
  };

  // WebSite schema with SearchAction — may trigger Google Sitelinks Searchbox
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: personName,
    url: BASE_URL,
    description: personDescription,
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <JsonLd data={personSchema} />
        <JsonLd data={websiteSchema} />
      </head>
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
