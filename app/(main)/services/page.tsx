import ServiceClient from "./ServiceClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Services | Nikola",
    description: "Services I offer",
};

export default async function Services() {
  return <ServiceClient />;
}