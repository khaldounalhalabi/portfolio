import Link from "next/link";

import FooterContactLinks from "@/components/portfolio/footer/footer-contact-links";
import { ReactNode } from "react";

export function SiteLayout({ children }: { children: ReactNode }) {
  const navLinks = [
    { href: "/", label: "Home" },
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
            KHALDOUN.ALHALABI
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm tracking-[0.2em] text-on-surface-variant uppercase hover:text-primary-container"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link
            href={"/contact"}
            className="rounded-full bg-secondary-fixed-dim px-5 py-2 text-sm font-semibold text-on-secondary"
          >
            Resume
          </Link>
        </div>
      </header>
      {children}
      <footer className="border-t border-white/5 bg-surface-container-low">
        <div className="container-shell flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-heading text-xs tracking-[0.3em] text-secondary uppercase">
              Available for new opportunities
            </p>
            <p className="mt-3 max-w-xl text-sm text-on-surface-variant">
              © 2026 Khaldoun Alhalabi.
            </p>
          </div>
          <FooterContactLinks />
        </div>
      </footer>
    </div>
  );
}
