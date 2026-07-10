import { Mail, MapPin, Phone } from "lucide-react";

import { FadeIn } from "@/components/motion/fade-in";
import { MagneticButton } from "@/components/motion/magnetic-button";
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
      label: "Whatsapp",
      href: `${whatsapp?.value}?text=${message}`,
    },
    { icon: IconBrandTelegram, label: "Telegram", href: telegram?.value },
    { icon: IconBrandGithub, label: "Github", href: github?.value },
    { icon: IconBrandGitlab, label: "Gitlab", href: gitlab?.value },
    {
      icon: IconBrandStackoverflow,
      label: "Stackoverflow",
      href: stackoverflow?.value,
    },
  ];

  return (
    <main className="pt-20 pb-24">
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
      <section className="container-shell">
        <FadeIn>
          <p className="text-xs tracking-[0.3em] text-secondary uppercase">
            Connection Node
          </p>
        </FadeIn>
        <TextReveal as="h1" className="mt-5" delay={0.1}>
          <span className="bg-linear-to-r from-primary via-primary-container to-secondary bg-clip-text font-heading text-5xl font-bold break-words text-transparent md:text-7xl">
            Get in Touch
          </span>
        </TextReveal>
        <FadeIn delay={0.2} className="mt-6 max-w-3xl">
          <p className="text-lg leading-8 text-on-surface-variant">
            Whether you have a technical challenge, a project proposal, or just
            want to discuss the future of full-stack architecture, my digital
            door is open.
          </p>
        </FadeIn>
      </section>

      <section className="container-shell mt-14 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <FadeIn delay={0.2} direction="up">
          <div className="max-w-[90vw] rounded-[2rem] border border-white/6 bg-surface-container-low/80 p-6 backdrop-blur-sm md:max-w-full md:p-8">
            <p className="text-xs tracking-[0.3em] text-secondary uppercase">
              Contact Details
            </p>
            <StaggerContainer className="mt-8 space-y-4" staggerDelay={0.08}>
              {contactDetails.map(
                (detail) =>
                  detail.value && (
                    <StaggerItem key={detail.label}>
                      {detail.href ? (
                        <a
                          href={detail.href}
                          target={detail.external ? "_blank" : undefined}
                          rel={detail.external ? "noreferrer" : undefined}
                          className="group flex items-start gap-4 rounded-2xl border border-transparent bg-surface-container-high p-5 transition-all duration-300 hover:border-primary-container/20 hover:bg-surface-container"
                        >
                          <div className="rounded-xl bg-surface-container p-3 text-primary-container transition-colors group-hover:bg-primary-container/10">
                            <detail.icon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs tracking-[0.25em] text-on-surface-variant uppercase">
                              {detail.label}
                            </p>
                            <p className="mt-2 wrap-break-word text-primary transition-colors group-hover:text-primary-container">
                              {detail.value}
                            </p>
                          </div>
                        </a>
                      ) : (
                        <div className="flex items-start gap-4 rounded-2xl bg-surface-container-high p-5">
                          <div className="rounded-xl bg-surface-container p-3 text-primary-container">
                            <detail.icon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs tracking-[0.25em] text-on-surface-variant uppercase">
                              {detail.label}
                            </p>
                            <p className="mt-2 wrap-break-word text-primary">
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
        </FadeIn>

        <aside className="space-y-8">
          <FadeIn delay={0.3} direction="up">
            <div className="rounded-[2rem] border border-white/6 bg-surface-container-low/80 p-6 backdrop-blur-sm md:p-8">
              <p className="text-xs tracking-[0.3em] text-secondary uppercase">
                Social Nodes
              </p>
              <div className="mt-6 grid gap-3">
                {socialLinks.map(
                  (social) =>
                    social.href && (
                      <MagneticButton
                        key={social.label}
                        strength={0.15}
                        className="w-full"
                      >
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noreferrer"
                          className="group flex w-full items-center gap-3 rounded-2xl border border-transparent bg-surface-container-high px-5 py-4 text-on-surface-variant transition-all duration-300 hover:border-primary-container/20 hover:bg-surface-container hover:text-primary"
                        >
                          <social.icon className="h-5 w-5 shrink-0 transition-colors group-hover:text-primary-container" />
                          <span className="min-w-0 flex-1 truncate font-medium">
                            {social.label}
                          </span>
                        </a>
                      </MagneticButton>
                    ),
                )}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.4} direction="up">
            <div className="relative overflow-hidden rounded-[2rem] border border-primary-container/15 bg-linear-to-br from-primary-container/10 via-background to-secondary/5 p-6 md:p-8">
              <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary-container/10 blur-[80px]" />
              <p className="text-xs tracking-[0.3em] text-secondary uppercase">
                Availability
              </p>
              <h2 className="relative mt-4 font-heading text-3xl font-bold break-words text-primary">
                Available for new opportunities
              </h2>
              <p className="relative mt-3 text-sm leading-6 text-on-surface-variant">
                Currently open to full-stack, backend-heavy, and architecture
                roles. Let&apos;s build something great.
              </p>
            </div>
          </FadeIn>
        </aside>
      </section>
    </main>
  );
}
