import AboutClient from "./AboutClient";
import { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
    title: "About",
    description:
        "Learn more about my journey, engineering philosophy, and what drives my passion for building exceptional digital experiences.",
    alternates: {
        canonical: `${BASE_URL}/about`,
    },
    openGraph: {
        title: "About | Nikola Srdoc",
        description:
            "Learn more about my journey, engineering philosophy, and what drives my passion for building exceptional digital experiences.",
        type: "profile",
        url: `${BASE_URL}/about`,
        images: [{ url: `${BASE_URL}/nikola.jpeg`, width: 800, height: 800, alt: "Nikola Srdoc" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "About | Nikola Srdoc",
        description:
            "Learn more about my journey, engineering philosophy, and what drives my passion for building exceptional digital experiences.",
        images: [`${BASE_URL}/nikola.jpeg`],
    },
};

export default async function About() {
  return <AboutClient />;
}