import { FadeIn } from "@/components/motion/fade-in";
import { TextReveal } from "@/components/motion/text-reveal";
import { ProjectsExplorer } from "@/components/portfolio/projects-explorer";
import { createClient } from "@/lib/supabase/server";
import ProjectService from "@/services/ProjectService";

export default async function ProjectsPage() {
  const supabase = await createClient();
  const projects = await ProjectService.make().setClient(supabase).all();

  return (
    <main className="pt-20 pb-24">
      <section className="container-shell mb-12">
        <FadeIn>
          <p className="text-xs tracking-[0.3em] text-secondary uppercase">
            Showcase
          </p>
        </FadeIn>
        <TextReveal as="h1" className="mt-5" delay={0.1}>
          <span className="font-heading text-5xl font-bold text-primary md:text-7xl">
            Selected Works
          </span>
        </TextReveal>
        <FadeIn delay={0.2} className="mt-6 max-w-2xl">
          <p className="text-lg leading-8 text-on-surface-variant">
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
