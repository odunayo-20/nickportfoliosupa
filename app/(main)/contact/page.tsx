import ContactClient from "./ContactClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact | Nikola",
    description: "Contact me to discuss potential collaborations, projects, or any inquiries.",
};

export default async function Contact() {
  return <ContactClient />;
}