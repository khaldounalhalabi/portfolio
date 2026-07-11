import Link from "next/link";
import { notFound } from "next/navigation";

import { FadeIn } from "@/components/motion/fade-in";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";
import { TextReveal } from "@/components/motion/text-reveal";
import { PortfolioIcon } from "@/components/portfolio/portfolio-icons";
import { ProjectMedia } from "@/components/portfolio/project-media";
import { RichTextContent } from "@/components/portfolio/rich-text-content";
import { hasRichTextContent } from "@/lib/rich-text";
import { createClient } from "@/lib/supabase/server";
import Project from "@/models/Project";
import ProjectService from "@/services/ProjectService";
import { ArrowUpRight, ExternalLinkIcon } from "lucide-react";
import { breadcrumbJsonLd, generateJsonLd, projectJsonLd } from "@/lib/seo";
import { stripRichText } from "@/lib/rich-text";
import type { Metadata } from "next";

interface TechStackItem {
  name: string;
  icon: string;
  description: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  let project;

  try {
    project = (await ProjectService.make()
      .setClient(supabase)
      .show(slug, undefined, "slug")) as Project | null;
  } catch {
    return {
      title: "Project Not Found",
      robots: { index: false, follow: true },
    };
  }

  if (!project) {
    return {
      title: "Project Not Found",
      robots: { index: false, follow: true },
    };
  }

  const description = stripRichText(
    project.long_description || project.description,
  ).slice(0, 160);

  return {
    title: project.title,
    description,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
    openGraph: {
      title: project.title,
      description,
      url: `/projects/${project.slug}`,
      type: "article",
      images: [`/projects/${project.slug}/opengraph-image`],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description,
      images: [`/projects/${project.slug}/opengraph-image`],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const supabase = await createClient();
  let project;

  try {
    project = (await ProjectService.make()
      .setClient(supabase)
      .show(slug, undefined, "slug")) as Project | null;
  } catch {
    notFound();
  }

  if (!project) {
    notFound();
  }

  const techStack = (project.tech_stack as TechStackItem[] | null) ?? [];

  const meta = [
    { label: "Role", value: project.role || "Lead Full-Stack Architect" },
    { label: "Year", value: project.year || "—" },
    ...(project.category
      ? [{ label: "Category", value: project.category }]
      : []),
    ...(project.employer ? [{ label: "Employer", value: project.employer }] : []),
  ];

  return (
    <main className="pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateJsonLd({
          "@context": "https://schema.org",
          "@graph": [
            projectJsonLd({
              title: project.title,
              slug: project.slug,
              description: project.description,
              longDescription: project.long_description,
              imageUrl: project.image_url,
              projectUrl: project.project_url,
              role: project.role,
              year: project.year,
              category: project.category,
              tags: project.tags,
              techStack: techStack.map((tech) => ({
                name: tech.name,
                description: tech.description,
              })),
              features: project.features,
              updatedAt: project.updated_at,
              createdAt: project.created_at,
            }),
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Projects", path: "/projects" },
              { name: project.title, path: `/projects/${project.slug}` },
            ]),
          ],
        })}
      />

      {/* Header */}
      <section className="border-b border-border">
        <div className="container-shell pt-16 pb-12 md:pt-20">
          <FadeIn>
            <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
              <Link href="/projects" className="hover:text-foreground">
                Work
              </Link>
              <span className="text-border">/</span>
              <span className="text-foreground">{project.category}</span>
            </div>
          </FadeIn>

          <TextReveal as="h1" className="mt-8 max-w-4xl" delay={0.05}>
            <span className="font-heading text-4xl font-semibold tracking-tight break-words text-foreground md:text-6xl lg:text-7xl">
              {project.title}
            </span>
          </TextReveal>

          <FadeIn delay={0.15} className="mt-8 max-w-3xl">
            <div className="text-lg leading-8 text-muted-foreground">
              <RichTextContent
                value={project.long_description || project.description}
              />
            </div>
          </FadeIn>

          {project.project_url && (
            <FadeIn delay={0.2}>
              <Link
                href={project.project_url}
                rel="noreferrer"
                target="_blank"
                className="group mt-8 inline-flex items-center gap-2 bg-foreground px-6 py-3 font-mono text-sm text-background transition-opacity hover:opacity-90"
              >
                Visit live project
                <ExternalLinkIcon className="h-4 w-4" />
              </Link>
            </FadeIn>
          )}

          {/* Meta row */}
          <FadeIn delay={0.25}>
            <dl className="mt-12 grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4">
              {meta.map((item) => (
                <div key={item.label} className="bg-background p-5">
                  <dt className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
                    {item.label}
                  </dt>
                  <dd className="mt-2 font-heading text-lg text-foreground">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </FadeIn>
        </div>
      </section>

      {/* Media */}
      <section className="border-b border-border">
        <div className="container-shell py-12 md:py-16">
          <FadeIn>
            <div className="relative aspect-video overflow-hidden border border-border">
              <ProjectMedia
                imageUrl={project.image_url}
                title={project.title}
                priority
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="border-b border-border">
        <div className="container-shell grid gap-px bg-background md:grid-cols-2">
          <div className="bg-background py-12 md:py-16 md:pr-12">
            <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
              The problem
            </p>
            {hasRichTextContent(project.problem) ? (
              <RichTextContent value={project.problem} className="mt-6" />
            ) : (
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Legacy systems often suffer from fragmented data flows, brittle
                admin surfaces, and poor visibility into day-to-day operations.
              </p>
            )}
          </div>
          <div className="bg-background py-12 md:py-16 md:pl-12">
            <p className="font-mono text-xs tracking-wide text-foreground uppercase">
              The solution
            </p>
            {hasRichTextContent(project.solution) ? (
              <RichTextContent value={project.solution} className="mt-6" />
            ) : (
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                The solution consolidates critical workflows into a maintainable
                architecture with a clean interface and a data model designed to
                evolve.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Overview */}
      {hasRichTextContent(project.long_description) ? (
        <section className="border-b border-border">
          <div className="container-shell py-16">
            <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
              Overview
            </p>
            <FadeIn className="mt-6 max-w-3xl">
              <RichTextContent value={project.long_description} />
            </FadeIn>
          </div>
        </section>
      ) : null}

      {/* Tech stack */}
      {techStack.length ? (
        <section className="border-b border-border">
          <div className="container-shell py-16">
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                {String(techStack.length).padStart(2, "0")}
              </span>
              <h2 className="font-heading text-sm font-medium tracking-wide text-foreground uppercase">
                Engineered with
              </h2>
            </div>
            <StaggerContainer
              className="mt-10 grid grid-cols-1 gap-5 bg-background sm:grid-cols-2 xl:grid-cols-4"
              staggerDelay={0.05}
            >
              {techStack.map((tech) => (
                <StaggerItem key={`${project.id}-${tech.name}`}>
                  <div className="group border border-border shadow-md flex h-full flex-col bg-background p-6 transition-colors hover:bg-surface-container-low">
                    <PortfolioIcon
                      name={tech.icon}
                      className="h-6 w-6 text-foreground"
                    />
                    <h3 className="mt-5 font-heading text-lg font-semibold text-foreground">
                      {tech.name}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {tech.description}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      ) : null}

      {/* Features */}
      {project.features.length ? (
        <section className="border-b border-border">
          <div className="container-shell py-16">
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                {String(project.features.length).padStart(2, "0")}
              </span>
              <h2 className="font-heading text-sm font-medium tracking-wide text-foreground uppercase">
                Key outcomes
              </h2>
            </div>
            <StaggerContainer className="mt-10 border-t border-border" staggerDelay={0.06}>
              {project.features.map((feature, index) => (
                <StaggerItem key={`${project.id}-feature-${index}`}>
                  <div className="flex gap-6 border-b border-border py-6">
                    <span className="font-mono text-xs text-muted-foreground tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-base leading-8 text-foreground/90">
                      {feature}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      ) : null}

      {/* CTA */}
      <section className="container-shell py-20">
        <FadeIn>
          <div className="flex flex-col items-start justify-between gap-8 border border-border p-10 md:flex-row md:items-center md:p-14">
            <h2 className="max-w-xl font-heading text-3xl font-semibold text-foreground md:text-4xl">
              Have a system worth building carefully?
            </h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 bg-foreground px-6 py-3 font-mono text-sm text-background transition-opacity hover:opacity-90"
              >
                Get in touch
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center border border-border px-6 py-3 font-mono text-sm text-foreground transition-colors hover:bg-surface-container-low"
              >
                More projects
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>
    </main>
  );
}
