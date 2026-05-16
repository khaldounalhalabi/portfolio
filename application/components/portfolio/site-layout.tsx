import Link from "next/link";

import type { ContactInfo, ContactLink } from "@/lib/portfolio/types";

export function SiteLayout({
  children,
  contactInfo,
  contactLinks,
}: {
  children: React.ReactNode;
  contactInfo: ContactInfo;
  contactLinks: ContactLink[];
}) {
  const navLinks = [
    { href: "/projects", label: "Projects" },
    { href: "/experience", label: "Experience" },
    { href: "/experience#skills", label: "Skills" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="container-shell flex items-center justify-between gap-4 py-5">
          <Link
            href="/"
            className="font-heading text-xl font-bold tracking-[0.2em] text-primary"
          >
            KHALDOUN.DEV
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary-container"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link
            href={contactInfo.resumeUrl || "/contact"}
            className="rounded-full bg-secondary-fixed-dim px-5 py-2 text-sm font-semibold text-on-secondary"
          >
            {contactInfo.resumeLabel || "Resume"}
          </Link>
        </div>
      </header>
      {children}
      <footer className="border-t border-white/5 bg-surface-container-low">
        <div className="container-shell flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-heading text-xs uppercase tracking-[0.3em] text-secondary">
              {contactInfo.availability}
            </p>
            <p className="mt-3 max-w-xl text-sm text-on-surface-variant">
              © 2026 Khaldoun Alhalabi. Built to pair a public portfolio with a
              manageable admin backend.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-on-surface-variant">
            {contactLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary-container"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
