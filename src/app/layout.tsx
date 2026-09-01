import type { Metadata } from "next";
import { Preloader } from "@/components/layout/Preloader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Opti-Plan   Universal Money Planner",
  description: "Subscription-based personal money planning web app & PWA.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <Preloader />
        {children}
      </body>
    </html>
  );
}
