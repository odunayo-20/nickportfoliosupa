import ServiceClient from "./ServiceClient";
import { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
    title: "Services",
    description:
        "Professional services offered by Nikola Srdoc — web development, system architecture, API design, and more.",
    alternates: {
        canonical: `${BASE_URL}/services`,
    },
    openGraph: {
        title: "Services | Nikola Srdoc",
        description:
            "Professional services offered by Nikola Srdoc — web development, system architecture, API design, and more.",
        type: "website",
        url: `${BASE_URL}/services`,
    },
    twitter: {
        card: "summary_large_image",
        title: "Services | Nikola Srdoc",
        description:
            "Professional services offered by Nikola Srdoc — web development, system architecture, API design, and more.",
    },
};

export default async function Services() {
  return <ServiceClient />;
}