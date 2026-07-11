import { Mail, MapPin, Phone } from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";
import { TextReveal } from "@/components/motion/text-reveal";
import SiteSettingKeyEnum from "@/enums/SiteSettingKeyEnum";
import { createClient } from "@/lib/supabase/server";
import SiteSettingService from "@/services/SiteSettingService";
import {
  IconBrandGithub,
  IconBrandGitlab,
  IconBrandLinkedin,
  IconBrandStackoverflow,
  IconBrandTelegram,
  IconBrandWhatsapp,
} from "@tabler/icons-react";
import {
  breadcrumbJsonLd,
  contactPageJsonLd,
  generateJsonLd,
} from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get in Touch",
  description:
    "Contact Khaldoun Alhalabi for full-stack architecture, engineering leadership, or your next technical challenge.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    url: "/contact",
  },
};

export default async function ContactPage() {
  const supabase = await createClient();
  const siteSettings = await SiteSettingService.make()
    .setClient(supabase)
    .getByKeys([
      SiteSettingKeyEnum.EMAIL,
      SiteSettingKeyEnum.LINKED_IN,
      SiteSettingKeyEnum.GITHUB,
      SiteSettingKeyEnum.PHONE,
      SiteSettingKeyEnum.LOCATION,
      SiteSettingKeyEnum.STACKOVERFLOW,
      SiteSettingKeyEnum.GITLAB,
      SiteSettingKeyEnum.WHATSAPP,
      SiteSettingKeyEnum.TELEGRAM,
      SiteSettingKeyEnum.PRE_FILLED_MESSAGE,
    ]);
  const find = <K extends SiteSettingKeyEnum>(key: K) =>
    siteSettings.find(
      (s): s is Extract<(typeof siteSettings)[number], { key: K }> =>
        s.key === key,
    ) ?? null;

  const email = find(SiteSettingKeyEnum.EMAIL);
  const phone = find(SiteSettingKeyEnum.PHONE);
  const location = find(SiteSettingKeyEnum.LOCATION);

  const linkedin = find(SiteSettingKeyEnum.LINKED_IN);
  const github = find(SiteSettingKeyEnum.GITHUB);
  const gitlab = find(SiteSettingKeyEnum.GITLAB);
  const stackoverflow = find(SiteSettingKeyEnum.STACKOVERFLOW);
  const whatsapp = find(SiteSettingKeyEnum.WHATSAPP);
  const telegram = find(SiteSettingKeyEnum.TELEGRAM);

  const subject = encodeURIComponent("New Project Inquiry");
  const message = encodeURIComponent(
    find(SiteSettingKeyEnum.PRE_FILLED_MESSAGE)?.value ?? "Hello",
  );

  const contactDetails = [
    {
      icon: Mail,
      label: "Email",
      href: `mailto:${email?.value}?subject=${subject}&body=${message}`,
      value: email?.value,
      external: true,
    },
    {
      icon: Phone,
      label: "Phone",
      href: `tel:${phone?.value?.replace(/\s+/g, "")}`,
      value: phone?.value,
      external: false,
    },
    {
      icon: MapPin,
      label: "Location",
      href: null,
      value: location?.value,
      external: false,
    },
  ];

  const socialLinks = [
    { icon: IconBrandLinkedin, label: "LinkedIn", href: linkedin?.value },
    {
      icon: IconBrandWhatsapp,
      label: "WhatsApp",
      href: whatsapp?.value ? `${whatsapp.value}?text=${message}` : undefined,
    },
    { icon: IconBrandTelegram, label: "Telegram", href: telegram?.value },
    { icon: IconBrandGithub, label: "GitHub", href: github?.value },
    { icon: IconBrandGitlab, label: "GitLab", href: gitlab?.value },
    {
      icon: IconBrandStackoverflow,
      label: "Stack Overflow",
      href: stackoverflow?.value,
    },
  ];

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateJsonLd({
          "@context": "https://schema.org",
          "@graph": [
            contactPageJsonLd(),
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Contact", path: "/contact" },
            ]),
          ],
        })}
      />

      <section className="border-b border-border">
        <div className="container-shell py-20 md:py-28">
          <FadeIn>
            <p className="font-mono text-xs tracking-wide text-muted-foreground">
              01 — Contact
            </p>
          </FadeIn>
          <TextReveal as="h1" className="mt-6 max-w-4xl" delay={0.1}>
            <span className="font-heading text-5xl font-semibold tracking-tight break-words text-foreground md:text-7xl">
              Let&apos;s talk.
            </span>
          </TextReveal>
          <FadeIn delay={0.2} className="mt-8 max-w-2xl">
            <p className="text-lg leading-8 text-muted-foreground">
              Whether you have a technical challenge, a project proposal, or just
              want to discuss the future of full-stack architecture — the door is
              open. Fastest reply is by email.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="container-shell grid gap-px bg-background md:grid-cols-2">
        {/* Direct contact */}
        <div className="bg-background py-12 md:py-16 md:pr-12">
          <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
            Direct
          </p>
          <StaggerContainer className="mt-8 border-t border-border" staggerDelay={0.07}>
            {contactDetails.map(
              (detail) =>
                detail.value && (
                  <StaggerItem key={detail.label}>
                    {detail.href ? (
                      <a
                        href={detail.href}
                        target={detail.external ? "_blank" : undefined}
                        rel={detail.external ? "noreferrer" : undefined}
                        className="group flex items-center gap-5 border-b border-border py-5 transition-colors"
                      >
                        <detail.icon className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
                        <div className="min-w-0 flex-1">
                          <p className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
                            {detail.label}
                          </p>
                          <p className="mt-1 wrap-break-word text-foreground transition-colors group-hover:underline group-hover:decoration-border group-hover:underline-offset-4">
                            {detail.value}
                          </p>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-center gap-5 border-b border-border py-5">
                        <detail.icon className="h-5 w-5 shrink-0 text-muted-foreground" />
                        <div className="min-w-0 flex-1">
                          <p className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
                            {detail.label}
                          </p>
                          <p className="mt-1 wrap-break-word text-foreground">
                            {detail.value}
                          </p>
                        </div>
                      </div>
                    )}
                  </StaggerItem>
                ),
            )}
          </StaggerContainer>
        </div>

        {/* Elsewhere */}
        <div className="bg-background py-12 md:py-16 md:pl-12">
          <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
            Elsewhere
          </p>
          <StaggerContainer
            className="mt-8 grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2"
            staggerDelay={0.05}
          >
            {socialLinks.map(
              (social) =>
                social.href && (
                  <StaggerItem key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex h-full items-center gap-3 bg-background px-5 py-5 text-muted-foreground transition-colors hover:bg-surface-container-low hover:text-foreground"
                    >
                      <social.icon className="h-5 w-5 shrink-0" />
                      <span className="min-w-0 flex-1 truncate font-mono text-sm">
                        {social.label}
                      </span>
                      <span className="text-muted-foreground transition-transform group-hover:translate-x-0.5">
                        ↗
                      </span>
                    </a>
                  </StaggerItem>
                ),
            )}
          </StaggerContainer>

          <FadeIn delay={0.3}>
            <div className="mt-8 flex items-center gap-3 border border-border p-6">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-foreground" />
              </span>
              <p className="font-mono text-xs text-muted-foreground">
                Currently open to full-stack, backend-heavy &amp; architecture
                roles.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="pb-24" />
    </main>
  );
}
