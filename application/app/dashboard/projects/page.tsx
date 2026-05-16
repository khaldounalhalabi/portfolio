import Link from "next/link";

import { hasSupabaseServerEnv } from "@/integrations/supabase/server";
import { getPortfolioData } from "@/lib/portfolio/queries";
import { stripRichText } from "@/lib/portfolio/rich-text";

export default async function DashboardProjectsPage() {
  const { projects } = await getPortfolioData();
  const isConfigured = hasSupabaseServerEnv();

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/6 bg-surface-container-low p-6">
        <h1 className="font-heading text-3xl font-bold text-primary">
          Projects
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-on-surface-variant">
          Manage public case studies from a cleaner index. Open a dedicated page
          to create or edit a project, and use the rich-text editor for the
          narrative content.
        </p>
        {!isConfigured ? (
          <p className="mt-3 text-sm text-amber-200">
            Supabase is not configured, so submitting these forms will not
            persist changes yet.
          </p>
        ) : null}
        <div className="mt-5">
          <Link
            href="/dashboard/projects/new"
            className="inline-flex rounded-full bg-primary-container px-5 py-3 text-sm font-semibold text-on-primary"
          >
            New Project
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/6 bg-surface-container-low">
        <table className="min-w-full divide-y divide-white/6">
          <thead className="bg-surface-container-high/60">
            <tr className="text-left text-xs uppercase tracking-[0.22em] text-on-surface-variant">
              <th className="px-6 py-4">Project</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Featured</th>
              <th className="px-6 py-4">Order</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/6">
            {projects.map((project) => (
              <tr key={project.id} className="align-top">
                <td className="px-6 py-5">
                  <div className="font-medium text-primary">{project.title}</div>
                  <div className="mt-1 text-sm text-on-surface-variant">
                    /projects/{project.slug}
                  </div>
                  <div className="mt-2 max-w-xl text-sm leading-7 text-on-surface-variant">
                    {stripRichText(project.description).slice(0, 140) || "No summary yet."}
                  </div>
                </td>
                <td className="px-6 py-5 text-sm text-on-surface-variant">
                  {project.category}
                </td>
                <td className="px-6 py-5 text-sm text-on-surface-variant">
                  {project.featured ? "Yes" : "No"}
                </td>
                <td className="px-6 py-5 text-sm text-on-surface-variant">
                  {project.displayOrder}
                </td>
                <td className="px-6 py-5">
                  <Link
                    href={`/dashboard/projects/${project.slug}`}
                    className="text-sm font-semibold text-primary-container"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
