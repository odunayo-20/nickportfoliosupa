import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication | Architect",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen w-full">
      {children}
    </div>
  );
}
