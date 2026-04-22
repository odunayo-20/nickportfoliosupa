import WhitelistClient from "./WhitelistClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Whitelist | Nikola",
    description: "Whitelist for me",
};

export default async function Whitelist() {
  return <WhitelistClient />;
}