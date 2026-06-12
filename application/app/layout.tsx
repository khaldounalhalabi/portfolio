import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";

import QueryClientProvider from "@/components/providers/QueryClientProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const heading = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Khaldoun.dev",
  description:
    "Full-stack architect portfolio with a Supabase-backed admin dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body
        className={`${sans.variable} ${heading.variable} min-h-full bg-background font-sans text-foreground`}
      >
        <QueryClientProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
