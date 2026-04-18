import "../main.css";
import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="antialiased selection:bg-brand-orange selection:text-brand-dark min-h-screen flex flex-col">
       <Navbar />
          <main className="flex-grow">
            {children}
          </main>
        <Footer />
    </div>
  );
}
