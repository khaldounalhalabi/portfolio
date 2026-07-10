import { ArrowDown, ArrowRight } from "lucide-react";
import Link from "next/link";

import { FadeIn } from "@/components/motion/fade-in";
import { GradientSpotlight } from "@/components/motion/gradient-spotlight";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { TextReveal } from "@/components/motion/text-reveal";
import { FeaturedProjectsCarousel } from "@/components/portfolio/featured-projects-carousel";
import { SkillsGrid } from "@/components/portfolio/skills-grid";
import SiteSettingKeyEnum from "@/enums/SiteSettingKeyEnum";
import { createClient } from "@/lib/supabase/server";
import ProjectService from "@/services/ProjectService";
import SiteSettingService from "@/services/SiteSettingService";
import SkillCategoryService from "@/services/SkillCategoryService";
import { RichTextContent } from "@/components/portfolio/rich-text-content";
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
  )?.value;

  const heroSkills = siteSettings.find(
    (s) => s.key == SiteSettingKeyEnum.HERO_SKILLS,
  )?.value;

  const heroParagraph = siteSettings.find(
    (s) => s.key == SiteSettingKeyEnum.HERO_PARAGRAPH,
  )?.value;

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateJsonLd({
          "@context": "https://schema.org",
          "@graph": [
            { "@id": `${siteConfig.url}/#person`, ...personJsonLd() },
            { "@id": `${siteConfig.url}/#website`, ...websiteJsonLd() },
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
            ]),
          ],
        })}
      />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-fade opacity-70" />
        <GradientSpotlight
          className="top-20 -left-40"
          color="cyan"
          size={500}
        />
        <GradientSpotlight
          className="right-0 bottom-0"
          color="green"
          size={450}
        />
        <GradientSpotlight
          className="top-1/2 left-1/3 -translate-x-1/2"
          color="mixed"
          size={300}
        />

        <div className="relative container-shell flex min-h-[calc(100vh-4.5rem)] flex-col justify-center py-16 md:min-h-[calc(100vh-5rem)] md:py-20">
          <FadeIn delay={0.1}>
            <div className="inline-flex w-fit items-center gap-3 rounded-full border border-white/10 bg-surface-container-low/80 px-4 py-2 backdrop-blur-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-secondary" />
              </span>
              <span className="text-xs tracking-[0.25em] text-secondary uppercase">
                Available for new opportunities
              </span>
            </div>
          </FadeIn>

          <TextReveal as="h1" className="mt-8 max-w-5xl" delay={0.2}>
            <span className="block font-heading text-4xl font-bold tracking-tight break-words text-primary sm:text-5xl md:text-7xl lg:text-8xl">
              Khaldoun Alhalabi
            </span>
            <span className="mt-3 block bg-linear-to-r from-primary via-primary-container to-secondary bg-clip-text break-words text-transparent text-glow md:mt-5">
              {heroSentence}
            </span>
          </TextReveal>

          <FadeIn delay={0.4} direction="up" distance={20}>
            <div className="mt-8 flex flex-wrap gap-3 text-xs tracking-[0.2em] text-on-surface-variant uppercase md:gap-4 md:text-sm">
              {heroSkills?.map((skill, index) => (
                <span
                  key={index}
                  className="rounded-full border border-white/8 bg-surface-container-low/60 px-3 py-1.5 backdrop-blur-sm transition-colors hover:border-primary-container/30 hover:text-primary"
                >
                  {skill}
                </span>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.5} direction="up" distance={20}>
            <div className="mt-8 max-w-3xl text-lg leading-8 text-on-surface-variant md:text-xl md:leading-9">
              <RichTextContent value={heroParagraph ?? ""}/>
            </div>
          </FadeIn>

          <FadeIn delay={0.6} direction="up" distance={20}>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <MagneticButton strength={0.25}>
                <Link
                  href="/projects"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-secondary-fixed-dim px-7 py-4 font-semibold text-on-secondary transition-shadow hover:shadow-[0_0_30px_-5px_rgba(0,228,117,0.45)]"
                >
                  Explore My Work
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </MagneticButton>
              <MagneticButton strength={0.25}>
                <Link
                  href="/experience"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-surface-container-low/60 px-7 py-4 font-semibold text-primary backdrop-blur-sm transition-all hover:border-primary-container/30 hover:bg-surface-container"
                >
                  View Technical Skills
                </Link>
              </MagneticButton>
            </div>
          </FadeIn>

          <FadeIn
            delay={0.8}
            className="relative mt-12 flex justify-center md:absolute md:bottom-8 md:left-1/2 md:mt-0 md:-translate-x-1/2"
          >
            <Link
              href="#featured"
              className="flex flex-col items-center gap-2 text-xs tracking-[0.2em] text-on-surface-variant uppercase transition-colors hover:text-primary-container"
            >
              <span className="hidden md:inline">Scroll</span>
              <ArrowDown className="h-4 w-4 animate-bounce" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {featuredProjects.length > 0 && (
        <div id="featured">
          <FeaturedProjectsCarousel projects={featuredProjects} />
        </div>
      )}

      <section className="relative py-24 md:py-32">
        <div className="container-shell">
          <div className="flex items-end justify-between gap-6">
            <div>
              <FadeIn>
                <p className="text-xs tracking-[0.3em] text-secondary uppercase">
                  Toolbox
                </p>
              </FadeIn>
              <TextReveal as="h2" className="mt-4" delay={0.1}>
                <span className="font-heading text-3xl font-bold break-words text-primary md:text-5xl">
                  Skills that translate into shipped systems
                </span>
              </TextReveal>
            </div>
            <FadeIn delay={0.2} className="hidden md:block">
              <Link
                href="/experience"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-primary-container"
              >
                Open full experience
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </FadeIn>
          </div>

          <SkillsGrid skillCategories={skillCategories} />
        </div>
      </section>
    </main>
  );
}
