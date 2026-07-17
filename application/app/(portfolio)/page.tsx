import { ArrowDown, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { FadeIn } from "@/components/motion/fade-in";
import { Marquee } from "@/components/motion/marquee";
import { TextReveal } from "@/components/motion/text-reveal";
import { FeaturedProjectsCarousel } from "@/components/portfolio/featured-projects-carousel";
import { HeroGridBackground } from "@/components/portfolio/hero-grid-background";
import { RichTextContent } from "@/components/portfolio/rich-text-content";
import { SkillsGrid } from "@/components/portfolio/skills-grid";
import SiteSettingKeyEnum from "@/enums/SiteSettingKeyEnum";
import { createClient } from "@/lib/supabase/server";
import ProjectService from "@/services/ProjectService";
import SiteSettingService from "@/services/SiteSettingService";
import SkillCategoryService from "@/services/SkillCategoryService";
import {
  breadcrumbJsonLd,
  generateJsonLd,
  personJsonLd,
  siteConfig,
  websiteJsonLd,
} from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Khaldoun Alhalabi | Full-Stack Architect & Engineering Leader",
  description:
    "Portfolio of Khaldoun Alhalabi, a full-stack architect and engineering leader building scalable Laravel backends, modern React systems, and AI-flavored tooling.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: "/",
  },
};

export default async function HomePage() {
  const supabase = await createClient();
  const projects = await ProjectService.make().setClient(supabase).all();
  const featuredProjects = projects
    .filter((project) => project.featured)
    .sort((a, b) => a.display_order - b.display_order);

  const siteSettings = await SiteSettingService.make()
    .setClient(supabase)
    .all();
  const skillCategories = await SkillCategoryService.make()
    .setClient(supabase)
    .all(["skills"]);

  const heroSentence = siteSettings.find(
    (s) => s.key == SiteSettingKeyEnum.HERO_SENTENCE_UNDER_NAME,
  )?.value as string | undefined;

  const heroSkills = siteSettings.find(
    (s) => s.key == SiteSettingKeyEnum.HERO_SKILLS,
  )?.value as string[] | undefined;

  const heroParagraph = siteSettings.find(
    (s) => s.key == SiteSettingKeyEnum.HERO_PARAGRAPH,
  )?.value as string | undefined;

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateJsonLd({
          "@context": "https://schema.org",
          "@graph": [
            { "@id": `${siteConfig.url}/#person`, ...personJsonLd() },
            { "@id": `${siteConfig.url}/#website`, ...websiteJsonLd() },
            breadcrumbJsonLd([{ name: "Home", path: "/" }]),
          ],
        })}
      />

      {/* Hero */}
      <section id="hero" className="relative overflow-hidden border-b border-border">
        <HeroGridBackground />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-background to-transparent" />

        <div className="relative container-shell flex min-h-[calc(100vh-4rem)] flex-col justify-center py-20">
          <FadeIn>
            <div className="flex items-center gap-3 font-mono text-xs tracking-wide text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-foreground" />
              </span>
              Available for new opportunities
            </div>
          </FadeIn>

          <TextReveal as="h1" className="mt-10 max-w-4xl" delay={0.1}>
            <span className="block font-heading text-5xl font-semibold tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
              Khaldoun
              <br />
              Alhalabi
            </span>
          </TextReveal>

          <FadeIn delay={0.3} className="mt-8 max-w-2xl">
            <p className="border-l border-border pl-5 font-heading text-xl leading-relaxed text-foreground/90 md:text-2xl">
              {heroSentence}
            </p>
          </FadeIn>

          {heroParagraph && (
            <FadeIn delay={0.4} className="mt-8 max-w-2xl">
              <div className="text-base leading-7 text-muted-foreground md:text-lg">
                <RichTextContent value={heroParagraph} />
              </div>
            </FadeIn>
          )}

          <FadeIn delay={0.5}>
            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/projects"
                className="group inline-flex items-center justify-center gap-2 bg-foreground px-7 py-3.5 font-mono text-sm text-background transition-opacity hover:opacity-90"
              >
                View selected work
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="/experience"
                className="inline-flex items-center justify-center gap-2 border border-border px-7 py-3.5 font-mono text-sm text-foreground transition-colors hover:bg-surface-container-low"
              >
                Experience &amp; skills
              </Link>
            </div>
          </FadeIn>

          <FadeIn
            delay={0.8}
            className="mt-16 hidden md:absolute md:right-10 md:bottom-8 md:mt-0 md:block"
          >
            <Link
              href="#featured"
              className="flex flex-col items-center gap-2 font-mono text-xs tracking-wide text-muted-foreground transition-colors hover:text-foreground"
            >
              Scroll
              <ArrowDown className="h-4 w-4 animate-bounce" />
            </Link>
          </FadeIn>
        </div>

        {/* Skills marquee strip */}
        {heroSkills && heroSkills.length > 0 && (
          <div className="relative border-t border-border py-4 px-5">
            <Marquee duration={45} className="[--gap:2.5rem]">
              <div className="flex items-center gap-10 pr-10">
                {heroSkills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="flex items-center gap-10 font-mono text-sm text-muted-foreground"
                  >
                    {skill}
                    <span className="text-border">/</span>
                  </span>
                ))}
              </div>
            </Marquee>
          </div>
        )}
      </section>

      {featuredProjects.length > 0 && (
        <FeaturedProjectsCarousel projects={featuredProjects} />
      )}

      {/* Skills */}
      <section className="border-t border-border">
        <div className="container-shell py-20 md:py-28">
          <div className="flex items-baseline justify-between gap-6">
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                02
              </span>
              <h2 className="font-heading text-sm font-medium tracking-wide text-foreground uppercase">
                Capabilities
              </h2>
            </div>
            <Link
              href="/experience"
              className="hidden font-mono text-xs text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
            >
              Full experience ↗
            </Link>
          </div>

          <TextReveal as="h3" className="mt-8 max-w-3xl" delay={0.1}>
            <span className="font-heading text-3xl font-semibold text-foreground md:text-5xl">
              Skills that translate into shipped systems.
            </span>
          </TextReveal>

          <SkillsGrid skillCategories={skillCategories} />
        </div>
      </section>
    </main>
  );
}
