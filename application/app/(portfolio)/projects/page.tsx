import { FadeIn } from "@/components/motion/fade-in";
import { TextReveal } from "@/components/motion/text-reveal";
import { ProjectsExplorer } from "@/components/portfolio/projects-explorer";
import { createClient } from "@/lib/supabase/server";
import ProjectService from "@/services/ProjectService";
import {
  breadcrumbJsonLd,
  generateJsonLd,
  projectsCollectionJsonLd,
} from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Selected Works",
  description:
    "A curated set of systems, products, and experiments spanning Laravel-heavy backends, modern React stacks, and AI-flavored tooling.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    url: "/projects",
  },
};

export default async function ProjectsPage() {
  const supabase = await createClient();
  const projects = await ProjectService.make().setClient(supabase).all();

  return (
    <main className="pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateJsonLd({
          "@context": "https://schema.org",
          "@graph": [
            projectsCollectionJsonLd(projects),
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Projects", path: "/projects" },
            ]),
          ],
        })}
      />
      <section className="container-shell pt-20 pb-12 md:pt-28">
        <FadeIn>
          <p className="font-mono text-xs tracking-wide text-muted-foreground">
            {String(projects.length).padStart(2, "0")} — Selected works
          </p>
        </FadeIn>
        <TextReveal as="h1" className="mt-6" delay={0.1}>
          <span className="font-heading text-5xl font-semibold text-foreground md:text-7xl">
            Work
          </span>
        </TextReveal>
        <FadeIn delay={0.2} className="mt-6 max-w-2xl">
          <p className="text-lg leading-8 text-muted-foreground">
            A curated set of systems, products, and experiments spanning
            Laravel-heavy backends, modern React stacks, and AI-flavored
            tooling.
          </p>
        </FadeIn>
      </section>
      <ProjectsExplorer projects={projects} />
    </main>
  );
}
