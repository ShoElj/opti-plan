import type { Metadata } from "next";
import { Preloader } from "@/components/layout/Preloader";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Opti-Plan | Universal Money Planner",
  description: "A smart personal finance tracker and budgeting app. Track spending and savings, manage bills, and always know your 'Money Left' to spend with confidence.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Preloader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
