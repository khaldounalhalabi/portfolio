import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";

import QueryClientProvider from "@/components/providers/query-client-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import "./globals.css";

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const heading = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Khaldoun Alhalabi | Full-Stack Architect & Engineering Leader",
    template: "%s | Khaldoun",
  },
  description:
    "Portfolio of Khaldoun Alhalabi, a full-stack architect and engineering leader building scalable Laravel backends, modern React systems, and AI-flavored tooling.",
  keywords: [
    "Khaldoun Alhalabi",
    "Full-Stack Architect",
    "Software Engineer",
    "Engineering Leader",
    "Laravel",
    "React",
    "Next.js",
    "TypeScript",
    "Supabase",
    "System Architecture",
  ],
  authors: [{ name: "Khaldoun Alhalabi", url: "https://khaldoun.site" }],
  creator: "Khaldoun Alhalabi",
  publisher: "Khaldoun Alhalabi",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://khaldoun.site"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Khaldoun Alhalabi | Full-Stack Architect & Engineering Leader",
    description:
      "Portfolio of Khaldoun Alhalabi, a full-stack architect and engineering leader building scalable Laravel backends, modern React systems, and AI-flavored tooling.",
    url: "/",
    siteName: "Khaldoun Alhalabi",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  manifest: "/manifest.webmanifest",
  other: {
    "msapplication-TileColor": "#0b0b0c",
    "theme-color": "#0b0b0c",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0c" },
    { media: "(prefers-color-scheme: light)", color: "#0b0b0c" },
  ],
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body
        className={`${sans.variable} ${heading.variable} ${mono.variable} min-h-full bg-background font-sans text-foreground`}
      >
        <NextTopLoader />
        <Toaster />
        <QueryClientProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
