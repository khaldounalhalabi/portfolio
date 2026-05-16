import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { PortfolioIcon } from "@/components/portfolio/portfolio-icons";
import { ProjectMedia } from "@/components/portfolio/project-media";
import { SiteLayout } from "@/components/portfolio/site-layout";
import { getPortfolioData } from "@/lib/portfolio/queries";

export default async function HomePage() {
  const portfolio = await getPortfolioData();
  const featuredProject =
    portfolio.projects.find((project) => project.featured) ??
    portfolio.projects[0];

  return (
    <SiteLayout
      contactInfo={portfolio.contactInfo}
      contactLinks={portfolio.contactLinks}
    >
      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 grid-fade opacity-70" />
          <div className="absolute top-24 left-0 h-80 w-80 rounded-full bg-primary-container/10 blur-[120px]" />
          <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-secondary/10 blur-[120px]" />
          <div className="relative container-shell flex min-h-[calc(100vh-84px)] flex-col justify-center py-20">
            <div className="inline-flex w-fit items-center gap-3 rounded-full border border-white/10 bg-surface-container-low px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-secondary" />
              <span className="text-xs tracking-[0.25em] text-secondary uppercase">
                {portfolio.contactInfo.availability}
              </span>
            </div>
            <h1 className="mt-8 max-w-5xl font-heading text-5xl font-bold tracking-tight text-primary md:text-7xl lg:text-8xl">
              Khaldoun Alhalabi
              <span className="text-glow mt-3 block bg-linear-to-r from-primary to-primary-container bg-clip-text text-transparent">
                Full-Stack Architect
              </span>
            </h1>
            <div className="mt-8 flex flex-wrap gap-4 text-xs tracking-[0.3em] text-on-surface-variant uppercase md:text-sm">
              <span>PHP & Laravel</span>
              <span>React & Next.js</span>
              <span>Supabase & System Design</span>
            </div>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-on-surface-variant md:text-xl">
              Backend-first engineering with a strong frontend eye. I build
              scalable systems, sharp interfaces, and admin workflows that keep
              content maintainable after launch.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/projects"
                className="inline-flex items-center justify-center rounded-full bg-secondary-fixed-dim px-7 py-4 font-semibold text-on-secondary"
              >
                Explore My Work
              </Link>
              <Link
                href="/experience"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-7 py-4 font-semibold text-primary"
              >
                View Technical Skills
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {featuredProject ? (
          <section className="border-y border-white/5 bg-surface-container-low py-24">
            <div className="container-shell grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
              <div>
                <p className="text-xs tracking-[0.3em] text-secondary uppercase">
                  Featured System
                </p>
                <h2 className="mt-5 max-w-xl font-heading text-4xl font-bold text-primary md:text-5xl">
                  Building at the edge of performance.
                </h2>
                <p className="mt-6 max-w-xl text-lg leading-8 text-on-surface-variant">
                  My architecture approach combines dependable backend design,
                  maintainable admin surfaces, and clean interaction design.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {featuredProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-surface-container-high px-3 py-1 text-xs tracking-[0.25em] text-secondary uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/projects/${featuredProject.slug}`}
                  className="mt-8 inline-flex items-center gap-2 font-semibold text-primary-container"
                >
                  Open featured case study
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <Link
                href={`/projects/${featuredProject.slug}`}
                className="group relative block overflow-hidden rounded-[2rem] border border-white/5"
              >
                <div className="relative aspect-video">
                  <div className="transition duration-700 group-hover:scale-105">
                    <ProjectMedia
                      imageUrl={featuredProject.imageUrl}
                      title={featuredProject.title}
                      priority
                    />
                  </div>
                  <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-8">
                  <p className="text-xs tracking-[0.3em] text-secondary uppercase">
                    {featuredProject.category}
                  </p>
                  <h3 className="mt-3 font-heading text-3xl font-bold text-primary">
                    {featuredProject.title}
                  </h3>
                </div>
              </Link>
            </div>
          </section>
        ) : null}

        <section className="py-24">
          <div className="container-shell">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-xs tracking-[0.3em] text-secondary uppercase">
                  Toolbox
                </p>
                <h2 className="mt-4 font-heading text-4xl font-bold text-primary">
                  Skills that translate into shipped systems
                </h2>
              </div>
              <Link
                href="/experience"
                className="hidden text-sm font-semibold text-primary-container md:inline"
              >
                Open full experience
              </Link>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {portfolio.skillGroups.map((group) => (
                <div
                  key={group.id}
                  className={`rounded-3xl border p-6 ${
                    group.isHighlight
                      ? "border-primary-container/30 bg-surface-container"
                      : "border-white/6 bg-surface-container-low"
                  }`}
                >
                  <PortfolioIcon
                    name={group.icon}
                    className={`h-6 w-6 ${
                      group.isHighlight
                        ? "text-primary-container"
                        : "text-secondary"
                    }`}
                  />
                  <h3 className="mt-5 font-heading text-2xl font-bold text-primary">
                    {group.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-on-surface-variant">
                    {group.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-surface-container-high px-3 py-1 text-xs text-on-surface-variant"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </SiteLayout>
  );
}
