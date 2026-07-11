"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";

import FooterContactLinks from "@/components/portfolio/footer/footer-contact-links";
import { useSiteSettings } from "@/components/providers/site-settings-provider";
import SiteSettingKeyEnum from "@/enums/SiteSettingKeyEnum";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Index" },
  { href: "/projects", label: "Work" },
  { href: "/experience", label: "Experience" },
  { href: "/contact", label: "Contact" },
];

export function SiteLayout({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { get } = useSiteSettings();

  // Prefer the versioned URL stored on each regeneration (cache-busted); fall
  // back to the canonical /resume.pdf route when the setting is not yet set.
  const resumeHref =
    get(SiteSettingKeyEnum.RESUME_LINK)?.value || "/resume.pdf";

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.includes("#")) return pathname === href.split("#")[0];
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container-shell flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="group flex items-center gap-2 font-mono text-sm tracking-tight text-foreground"
          >
            <span className="inline-block h-2 w-2 shrink-0 bg-foreground transition-transform duration-300 group-hover:rotate-45" />
            <span>khaldoun.alhalabi</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group relative font-mono text-xs tracking-wide transition-colors",
                  isActive(link.href)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="text-muted-foreground/60 tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>{" "}
                {link.label}
                <span
                  className={cn(
                    "absolute -bottom-1.5 left-0 h-px bg-foreground transition-all duration-300",
                    isActive(link.href) ? "w-full" : "w-0 group-hover:w-full",
                  )}
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href={resumeHref}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 border border-border px-4 py-2 font-mono text-xs text-foreground transition-colors hover:bg-foreground hover:text-background md:inline-flex"
            >
              Résumé ↗
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center border border-border text-foreground md:hidden"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden border-b border-border bg-background md:hidden"
            >
              <nav className="container-shell flex flex-col py-2">
                {navLinks.map((link, index) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 border-b border-border py-4 font-mono text-sm transition-colors",
                      isActive(link.href)
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span className="text-muted-foreground/60 tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {link.label}
                  </Link>
                ))}
                <Link
                  href={resumeHref}
                  onClick={() => setMobileMenuOpen(false)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 mb-2 border border-border px-6 py-3 text-center font-mono text-sm text-foreground"
                >
                  Résumé ↗
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="border-t border-border">
        <div className="container-shell py-16">
          <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
            <div className="max-w-md">
              <p className="font-mono text-xs tracking-wide text-muted-foreground">
                Available for new work
              </p>
              <p className="mt-4 font-heading text-2xl font-medium text-foreground">
                Let&apos;s build something
                <br />
                worth maintaining.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-flex items-center gap-2 font-mono text-sm text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
              >
                Start a conversation ↗
              </Link>
            </div>
            <div className="flex flex-col items-start gap-6 md:items-end">
              <FooterContactLinks />
              <p className="font-mono text-xs text-muted-foreground">
                © {new Date().getFullYear()} Khaldoun Alhalabi
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
