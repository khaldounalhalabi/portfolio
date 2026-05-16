import { ProjectsExplorer } from "@/components/portfolio/projects-explorer";
import { getPortfolioData } from "@/lib/portfolio/queries";

export default async function ProjectsPage() {
  const { projects } = await getPortfolioData();

  return (
    <main className="pb-24 pt-20">
      <section className="container-shell mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-secondary">
          Showcase
        </p>
        <h1 className="mt-5 font-heading text-5xl font-bold text-primary md:text-7xl">
          Selected Works
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-on-surface-variant">
          A curated set of systems, products, and experiments spanning
          Laravel-heavy backends, modern React stacks, and AI-flavored tooling.
        </p>
      </section>
      <ProjectsExplorer projects={projects} />
    </main>
  );
}
