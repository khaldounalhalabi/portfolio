import Link from "next/link";
import { notFound } from "next/navigation";

import { FadeIn } from "@/components/motion/fade-in";
import { GradientSpotlight } from "@/components/motion/gradient-spotlight";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";
import { TextReveal } from "@/components/motion/text-reveal";
import { PortfolioIcon } from "@/components/portfolio/portfolio-icons";
import { ProjectMedia } from "@/components/portfolio/project-media";
import { RichTextContent } from "@/components/portfolio/rich-text-content";
import { hasRichTextContent, stripRichText } from "@/lib/rich-text";
import Project from "@/models/Project";
import ProjectService from "@/services/ProjectService";

interface TechStackItem {
  name: string;
  icon: string;
  description: string;
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let project;

  try {
    project = (await ProjectService.make().show(
      slug,
      undefined,
      "slug",
    )) as Project | null;
  } catch {
    notFound();
  }

  if (!project) {
    notFound();
  }

  const techStack = (project.tech_stack as TechStackItem[] | null) ?? [];

  return (
    <main className="relative pt-20 pb-24">
      <GradientSpotlight
        className="-top-20 -right-40"
        color="cyan"
        size={500}
      />

      <section className="relative container-shell">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-end">
          <div>
            <FadeIn>
              <p className="text-xs tracking-[0.3em] text-secondary uppercase">
                Featured Project
              </p>
            </FadeIn>
            <TextReveal as="h1" className="mt-5" delay={0.1}>
              <span className="font-heading text-4xl font-bold break-words text-primary md:text-6xl lg:text-7xl">
                {project.title}
              </span>
            </TextReveal>
            <FadeIn delay={0.2} className="mt-6 max-w-3xl">
              <p className="text-xl leading-9 text-on-surface-variant">
                {stripRichText(project.long_description || project.description)}
              </p>
            </FadeIn>
          </div>
          <FadeIn delay={0.3} direction="left">
            <div className="grid gap-4">
              <div className="rounded-3xl border border-white/6 bg-surface-container-low/80 p-6 backdrop-blur-sm">
                <p className="text-xs tracking-[0.25em] text-secondary uppercase">
                  Role
                </p>
                <p className="mt-3 font-heading text-xl text-primary">
                  {project.role || "Lead Full-Stack Architect"}
                </p>
              </div>
              <div className="rounded-3xl border border-white/6 bg-surface-container-low/80 p-6 backdrop-blur-sm">
                <p className="text-xs tracking-[0.25em] text-secondary uppercase">
                  Year
                </p>
                <p className="mt-3 font-heading text-xl text-primary">
                  {project.year || "2024"}
                </p>
              </div>
              {project.category && (
                <div className="rounded-3xl border border-white/6 bg-surface-container-low/80 p-6 backdrop-blur-sm">
                  <p className="text-xs tracking-[0.25em] text-secondary uppercase">
                    Category
                  </p>
                  <p className="mt-3 font-heading text-xl text-primary">
                    {project.category}
                  </p>
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="container-shell mt-14">
        <FadeIn>
          <div className="relative aspect-video overflow-hidden rounded-[2rem] border border-white/5">
            <ProjectMedia imageUrl={project.image_url} title={project.title} />
            <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />
          </div>
        </FadeIn>
      </section>

      <section className="container-shell mt-16 grid gap-12 lg:grid-cols-2">
        <FadeIn delay={0.1} direction="up">
          <div className="rounded-[2rem] border border-white/6 bg-surface-container-low/60 p-8 backdrop-blur-sm md:p-10">
            <p className="text-xs tracking-[0.3em] text-secondary uppercase">
              The Problem
            </p>
            {hasRichTextContent(project.problem) ? (
              <RichTextContent
                value={project.problem}
                className="mt-6 text-lg"
              />
            ) : (
              <p className="mt-6 text-lg leading-8 text-on-surface-variant">
                Legacy systems often suffer from fragmented data flows, brittle
                admin surfaces, and poor visibility into day-to-day operations.
              </p>
            )}
          </div>
        </FadeIn>
        <FadeIn delay={0.2} direction="up">
          <div className="rounded-[2rem] border border-white/6 bg-surface-container-low/60 p-8 backdrop-blur-sm md:p-10">
            <p className="text-xs tracking-[0.3em] text-primary-container uppercase">
              The Solution
            </p>
            {hasRichTextContent(project.solution) ? (
              <RichTextContent
                value={project.solution}
                className="mt-6 text-lg"
              />
            ) : (
              <p className="mt-6 text-lg leading-8 text-on-surface-variant">
                The solution consolidates critical workflows into a maintainable
                architecture with a clean interface and a data model designed to
                evolve.
              </p>
            )}
          </div>
        </FadeIn>
      </section>

      {hasRichTextContent(project.long_description) ? (
        <section className="container-shell mt-16">
          <FadeIn direction="up">
            <div className="rounded-[2rem] border border-white/6 bg-surface-container-low/60 p-8 backdrop-blur-sm md:p-10">
              <p className="text-xs tracking-[0.3em] text-secondary uppercase">
                Overview
              </p>
              <RichTextContent
                value={project.long_description}
                className="mt-6"
              />
            </div>
          </FadeIn>
        </section>
      ) : null}

      {techStack.length ? (
        <section className="container-shell mt-20">
          <FadeIn>
            <div className="mb-8 flex items-center gap-4">
              <h2 className="font-heading text-3xl font-bold text-primary">
                Engineered With
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            </div>
          </FadeIn>
          <StaggerContainer
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
            staggerDelay={0.06}
          >
            {techStack.map((tech) => (
              <StaggerItem
                key={`${project.id}-${tech.name}`}
                className="h-full"
              >
                <div className="group h-full rounded-3xl border border-white/6 bg-surface-container-low p-6 transition-all duration-500 hover:-translate-y-1 hover:border-primary-container/20 hover:bg-surface-container">
                  <PortfolioIcon
                    name={tech.icon}
                    className="h-7 w-7 text-primary-container transition-transform duration-300 group-hover:scale-110"
                  />
                  <h3 className="mt-5 font-heading text-xl font-bold text-primary">
                    {tech.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                    {tech.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      ) : null}

      {project.features.length ? (
        <section className="container-shell mt-20 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <FadeIn direction="up">
            <div>
              <h2 className="font-heading text-4xl font-bold text-primary">
                Architected for impact.
              </h2>
              <p className="mt-6 max-w-md text-lg leading-8 text-on-surface-variant">
                Every module is designed to remove operational friction while
                preserving room for future growth.
              </p>
            </div>
          </FadeIn>
          <StaggerContainer className="space-y-5" staggerDelay={0.08}>
            {project.features.map((feature, index) => (
              <StaggerItem key={`${project.id}-feature-${index}`}>
                <div className="rounded-3xl border border-white/6 bg-surface-container-low/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary-container/20 hover:bg-surface-container">
                  <p className="text-xs tracking-[0.25em] text-secondary uppercase">
                    Outcome {index + 1}
                  </p>
                  <p className="mt-4 text-base leading-8 text-on-surface-variant">
                    {feature}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      ) : null}

      <section className="container-shell mt-20">
        <FadeIn direction="up">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/6 bg-surface-container-low/80 p-10 text-center backdrop-blur-sm">
            <div className="absolute -top-20 -left-20 h-60 w-60 rounded-full bg-primary-container/10 blur-[100px]" />
            <div className="absolute -right-20 bottom-0 h-60 w-60 rounded-full bg-secondary/10 blur-[100px]" />
            <h2 className="relative font-heading text-3xl font-bold break-words text-primary md:text-4xl">
              Building the future of {project.title.split(" ")[0]}?
            </h2>
            <p className="relative mx-auto mt-5 max-w-2xl text-lg leading-8 text-on-surface-variant">
              Let&apos;s discuss a solution that stays performant, maintainable,
              and easy to operate after it ships.
            </p>
            <div className="relative mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <MagneticButton strength={0.25}>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-secondary-fixed-dim px-6 py-3 font-semibold text-on-secondary transition-shadow hover:shadow-[0_0_30px_-5px_rgba(0,228,117,0.45)]"
                >
                  Get in Touch
                </Link>
              </MagneticButton>
              <MagneticButton strength={0.25}>
                <Link
                  href="/projects"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-surface-container px-6 py-3 font-semibold text-primary transition-colors hover:border-primary-container/30"
                >
                  View More Projects
                </Link>
              </MagneticButton>
            </div>
          </div>
        </FadeIn>
      </section>
    </main>
  );
}
