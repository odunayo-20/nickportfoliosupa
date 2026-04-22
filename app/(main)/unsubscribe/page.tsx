import { Suspense } from "react";
import UnsubscribeClient from "./UnsubscribeClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Unsubscribe | Portfolio Newsletter",
    description: "Unsubscribe from our newsletter to stop receiving updates.",
};

export default function UnsubscribePage() {
    return (
        <main className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center px-4">
            <Suspense fallback={<div className="animate-pulse text-muted-foreground">Loading...</div>}>
                <UnsubscribeClient />
            </Suspense>
        </main>
    );
}
