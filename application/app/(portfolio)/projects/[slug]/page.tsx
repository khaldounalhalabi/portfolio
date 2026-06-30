import Link from "next/link";
import { notFound } from "next/navigation";

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
    <main className="pt-20 pb-24">
      <section className="container-shell">
        <div className="grid gap-10 lg:grid-cols-[1fr_280px] lg:items-end">
          <div>
            <p className="text-xs tracking-[0.3em] text-secondary uppercase">
              Featured Project
            </p>
            <h1 className="mt-5 font-heading text-5xl font-bold text-primary md:text-7xl">
              {project.title}
            </h1>
            <p className="mt-6 max-w-3xl text-xl leading-9 text-on-surface-variant">
              {stripRichText(project.long_description || project.description)}
            </p>
          </div>
          <div className="grid gap-4">
            <div className="rounded-3xl border border-white/6 bg-surface-container-low p-6">
              <p className="text-xs tracking-[0.25em] text-secondary uppercase">
                Role
              </p>
              <p className="mt-3 font-heading text-xl text-primary">
                {project.role || "Lead Full-Stack Architect"}
              </p>
            </div>
            <div className="rounded-3xl border border-white/6 bg-surface-container-low p-6">
              <p className="text-xs tracking-[0.25em] text-secondary uppercase">
                Year
              </p>
              <p className="mt-3 font-heading text-xl text-primary">
                {project.year || "2024"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell mt-14">
        <div className="relative aspect-video overflow-hidden rounded-[2rem] border border-white/5">
          <ProjectMedia imageUrl={project.image_url} title={project.title} />
          <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent" />
        </div>
      </section>

      <section className="container-shell mt-16 grid gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs tracking-[0.3em] text-secondary uppercase">
            The Problem
          </p>
          {hasRichTextContent(project.problem) ? (
            <RichTextContent value={project.problem} className="mt-6 text-lg" />
          ) : (
            <p className="mt-6 text-lg leading-8 text-on-surface-variant">
              Legacy systems often suffer from fragmented data flows, brittle
              admin surfaces, and poor visibility into day-to-day operations.
            </p>
          )}
        </div>
        <div>
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
      </section>

      {hasRichTextContent(project.long_description) ? (
        <section className="container-shell mt-18">
          <div className="rounded-[2rem] border border-white/6 bg-surface-container-low p-8 md:p-10">
            <p className="text-xs tracking-[0.3em] text-secondary uppercase">
              Overview
            </p>
            <RichTextContent
              value={project.long_description}
              className="mt-6"
            />
          </div>
        </section>
      ) : null}

      {techStack.length ? (
        <section className="container-shell mt-20">
          <div className="mb-8 flex items-center gap-4">
            <h2 className="font-heading text-3xl font-bold text-primary">
              Engineered With
            </h2>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {techStack.map((tech) => (
              <div
                key={`${project.id}-${tech.name}`}
                className="rounded-3xl border border-white/6 bg-surface-container-low p-6"
              >
                <PortfolioIcon
                  name={tech.icon}
                  className="h-7 w-7 text-primary-container"
                />
                <h3 className="mt-5 font-heading text-xl font-bold text-primary">
                  {tech.name}
                </h3>
                <p className="mt-2 text-sm text-on-surface-variant">
                  {tech.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {project.features.length ? (
        <section className="container-shell mt-20 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="font-heading text-4xl font-bold text-primary">
              Architected for impact.
            </h2>
            <p className="mt-6 max-w-md text-lg leading-8 text-on-surface-variant">
              Every module is designed to remove operational friction while
              preserving room for future growth.
            </p>
          </div>
          <div className="space-y-6">
            {project.features.map((feature, index) => (
              <div
                key={`${project.id}-feature-${index}`}
                className="rounded-3xl border border-white/6 bg-surface-container-low p-6"
              >
                <p className="text-xs tracking-[0.25em] text-secondary uppercase">
                  Outcome {index + 1}
                </p>
                <p className="mt-4 text-base leading-8 text-on-surface-variant">
                  {feature}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="container-shell mt-20">
        <div className="rounded-[2rem] border border-white/6 bg-surface-container-low p-10 text-center">
          <h2 className="font-heading text-4xl font-bold text-primary">
            Building the future of {project.title.split(" ")[0]}?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-on-surface-variant">
            Let&apos;s discuss a solution that stays performant, maintainable,
            and easy to operate after it ships.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="rounded-full bg-secondary-fixed-dim px-6 py-3 font-semibold text-on-secondary"
            >
              Get in Touch
            </Link>
            <Link
              href="/projects"
              className="rounded-full border border-white/10 px-6 py-3 font-semibold text-primary"
            >
              View More Projects
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
