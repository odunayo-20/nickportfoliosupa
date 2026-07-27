import ContactClient from "./ContactClient";
import { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
    title: "Contact",
    description: "Contact Nikola Srdoc to discuss potential collaborations, projects, or any inquiries.",
    alternates: {
        canonical: `${BASE_URL}/contact`,
    },
    openGraph: {
        title: "Contact | Nikola Srdoc",
        description: "Contact Nikola Srdoc to discuss potential collaborations, projects, or any inquiries.",
        type: "website",
        url: `${BASE_URL}/contact`,
    },
    twitter: {
        card: "summary",
        title: "Contact | Nikola Srdoc",
        description: "Contact Nikola Srdoc to discuss potential collaborations, projects, or any inquiries.",
    },
};

export default async function Contact() {
  return <ContactClient />;
}