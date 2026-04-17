import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import Sidebar from "./_components/Sidebar";
import TopNavBar from "./_components/TopNavBar";
import MobileNav from "./_components/MobileNav";


export const metadata: Metadata = {
    title: "Dashboard — Architect",
    description: "Manage your portfolio workspace.",
};

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="bg-background text-on-surface flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex flex-col h-full relative overflow-y-auto bg-background">
                <TopNavBar />
                {children}
                <MobileNav />
            </main>
        </div>
    );
}
