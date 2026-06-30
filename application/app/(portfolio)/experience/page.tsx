import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { FadeIn } from "@/components/motion/fade-in";
import { TextReveal } from "@/components/motion/text-reveal";
import { ExperienceTimeline } from "@/components/portfolio/experience-timeline";
import { SkillsGrid } from "@/components/portfolio/skills-grid";
import ExperienceService from "@/services/ExperienceService";
import SkillCategoryService from "@/services/SkillCategoryService";

export default async function ExperiencePage() {
  const experiences = await ExperienceService.make().all();
  const skillCategories = await SkillCategoryService.make().all(["skills"]);

  return (
    <main className="pt-20 pb-24">
      <section className="container-shell">
        <FadeIn>
          <p className="text-xs tracking-[0.3em] text-secondary uppercase">
            Chronology
          </p>
        </FadeIn>
        <TextReveal as="h1" className="mt-5" delay={0.1}>
          <span className="font-heading text-5xl font-bold text-primary md:text-7xl">
            Experience
          </span>
        </TextReveal>
        <FadeIn delay={0.2} className="mt-6 max-w-2xl">
          <p className="text-lg leading-8 text-on-surface-variant">
            A timeline of roles that shaped my approach to building reliable,
            scalable systems and working effectively across teams.
          </p>
        </FadeIn>
        <ExperienceTimeline experiences={experiences} />
      </section>

      <section id="skills" className="container-shell mt-24 md:mt-32">
        <div className="flex items-end justify-between gap-6">
          <div>
            <FadeIn>
              <p className="text-xs tracking-[0.3em] text-secondary uppercase">
                Toolbox
              </p>
            </FadeIn>
            <TextReveal as="h2" className="mt-4" delay={0.1}>
              <span className="font-heading text-4xl font-bold text-primary md:text-5xl">
                Skills & Tech
              </span>
            </TextReveal>
          </div>
          <FadeIn delay={0.2} className="hidden md:block">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-primary-container"
            >
              View projects
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </FadeIn>
        </div>
        <SkillsGrid skillCategories={skillCategories} />
      </section>
    </main>
  );
}
