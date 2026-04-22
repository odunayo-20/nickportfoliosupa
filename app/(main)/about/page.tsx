import AboutClient from "./AboutClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "About | Nikola",
    description: "Learn more about my journey, engineering philosophy, and what drives my passion for building exceptional digital experiences.",
};

export default async function About() {
  return <AboutClient />;
}