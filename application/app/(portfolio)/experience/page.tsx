import Link from "next/link";

import { FadeIn } from "@/components/motion/fade-in";
import { TextReveal } from "@/components/motion/text-reveal";
import { ExperienceTimeline } from "@/components/portfolio/experience-timeline";
import { SkillsGrid } from "@/components/portfolio/skills-grid";
import { createClient } from "@/lib/supabase/server";
import ExperienceService from "@/services/ExperienceService";
import SkillCategoryService from "@/services/SkillCategoryService";
import {
  breadcrumbJsonLd,
  experienceJsonLd,
  generateJsonLd,
} from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "A timeline of roles that shaped my approach to building reliable, scalable systems and working effectively across teams.",
  alternates: {
    canonical: "/experience",
  },
  openGraph: {
    url: "/experience",
  },
};

export default async function ExperiencePage() {
  const supabase = await createClient();
  const experiences = await ExperienceService.make().setClient(supabase).all();
  const skillCategories = await SkillCategoryService.make()
    .setClient(supabase)
    .all(["skills"]);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateJsonLd({
          "@context": "https://schema.org",
          "@graph": [
            experienceJsonLd(
              experiences.map((experience) => ({
                id: experience.id,
                companyName: experience.company_name,
                position: experience.position,
                jobDescription: experience.job_description,
                from: experience.from,
                to: experience.to,
                location: experience.location,
                companyWebsite: experience.company_website,
              })),
            ),
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Experience", path: "/experience" },
            ]),
          ],
        })}
      />

      <section className="border-b border-border">
        <div className="container-shell py-20 md:py-28">
          <FadeIn>
            <p className="font-mono text-xs tracking-wide text-muted-foreground">
              01 — Career
            </p>
          </FadeIn>
          <TextReveal as="h1" className="mt-6" delay={0.1}>
            <span className="font-heading text-5xl font-semibold text-foreground md:text-7xl">
              Experience
            </span>
          </TextReveal>
          <FadeIn delay={0.2} className="mt-6 max-w-2xl">
            <p className="text-lg leading-8 text-muted-foreground">
              A timeline of roles that shaped my approach to building reliable,
              scalable systems and working effectively across teams. Select any
              row for the full story.
            </p>
          </FadeIn>

          <ExperienceTimeline experiences={experiences} />
        </div>
      </section>

      <section id="skills" className="border-b border-border">
        <div className="container-shell py-20 md:py-28">
          <div className="flex items-baseline justify-between gap-6">
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                02
              </span>
              <h2 className="font-heading text-sm font-medium tracking-wide text-foreground uppercase">
                Skills &amp; tech
              </h2>
            </div>
            <Link
              href="/projects"
              className="hidden font-mono text-xs text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
            >
              View projects ↗
            </Link>
          </div>
          <SkillsGrid skillCategories={skillCategories} />
        </div>
      </section>
    </main>
  );
}
