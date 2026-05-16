import Link from "next/link";
import { notFound } from "next/navigation";

import { ProjectEditorCard } from "@/components/dashboard/project-editor";
import { getProjectBySlug } from "@/lib/portfolio/queries";

export default async function DashboardEditProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/6 bg-surface-container-low p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-primary">
              Edit Project
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-on-surface-variant">
              Update metadata, media, and rich case-study copy for
              <span className="text-primary"> {project.title}</span>.
            </p>
          </div>
          <Link
            href="/dashboard/projects"
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-primary"
          >
            Back to Projects
          </Link>
        </div>
      </div>

      <ProjectEditorCard project={project} />
    </div>
  );
}
