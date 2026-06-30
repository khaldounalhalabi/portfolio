"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";

import { MagneticButton } from "@/components/motion/magnetic-button";
import FooterContactLinks from "@/components/portfolio/footer/footer-contact-links";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/experience#skills", label: "Skills" },
  { href: "/contact", label: "Contact" },
];

export function SiteLayout({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    if (href.includes("#")) {
      return pathname === href.split("#")[0];
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-50">
        <header className="border-b border-white/5 bg-background/70 backdrop-blur-xl">
          <div className="container-shell flex items-center justify-between gap-4 py-4 md:py-5">
            <MagneticButton strength={0.15}>
              <Link
                href="/"
                className="group relative font-heading text-lg font-bold tracking-[0.15em] text-primary md:text-xl"
              >
                <span className="relative z-10">KHALDOUN.ALHALABI</span>
                <span className="absolute inset-x-0 -bottom-1 h-px scale-x-0 bg-primary-container transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            </MagneticButton>

            <nav className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-xs font-medium tracking-[0.15em] uppercase transition-colors",
                    isActive(link.href)
                      ? "text-primary"
                      : "text-on-surface-variant hover:text-primary-container",
                  )}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute inset-x-2 bottom-0 h-px bg-primary-container"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <MagneticButton strength={0.2} className="hidden md:block">
                <Link
                  href="/resume.pdf"
                  className="rounded-full bg-secondary-fixed-dim px-4 py-2 text-sm font-semibold text-on-secondary transition-all hover:shadow-[0_0_25px_-5px_rgba(0,228,117,0.4)] md:px-5"
                  target="_blank"
                  rel="noreferrer"
                >
                  Resume
                </Link>
              </MagneticButton>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-primary md:hidden"
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
        </header>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="absolute inset-x-0 top-full z-40 overflow-hidden border-b border-white/5 bg-background/95 backdrop-blur-xl md:hidden"
            >
              <nav className="container-shell flex flex-col py-4">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "block border-b border-white/5 py-4 text-sm font-medium tracking-[0.2em] uppercase transition-colors",
                        isActive(link.href)
                          ? "text-primary-container"
                          : "text-on-surface-variant hover:text-primary",
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                  className="pt-4"
                >
                  <Link
                    href="/resume.pdf"
                    onClick={() => setMobileMenuOpen(false)}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-full bg-secondary-fixed-dim px-6 py-3 text-center text-sm font-semibold text-on-secondary"
                  >
                    Download Resume
                  </Link>
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {children}

      <footer className="relative border-t border-white/5 bg-surface-container-low/50 backdrop-blur-sm">
        <div className="container-shell flex flex-col gap-8 py-12 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-heading text-xs tracking-[0.3em] text-secondary uppercase">
              Available for new opportunities
            </p>
            <p className="mt-3 max-w-xl text-sm text-on-surface-variant">
              © {new Date().getFullYear()} Khaldoun Alhalabi. Built with
              Next.js, Supabase, and attention to detail.
            </p>
          </div>
          <FooterContactLinks />
        </div>
      </footer>
    </div>
  );
}
