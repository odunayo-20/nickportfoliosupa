import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary selection:text-on-primary">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 md:px-8 py-8 w-full flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}
