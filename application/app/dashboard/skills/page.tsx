import Link from "next/link";

import { hasSupabaseServerEnv } from "@/integrations/supabase/server";
import { getPortfolioData } from "@/lib/portfolio/queries";

export default async function DashboardSkillsPage() {
  const { skillGroups } = await getPortfolioData();
  const isConfigured = hasSupabaseServerEnv();

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/6 bg-surface-container-low p-6">
        <h1 className="font-heading text-3xl font-bold text-primary">Skills</h1>
        <p className="mt-3 text-sm leading-7 text-on-surface-variant">
          Manage skill groups from an index page, then open a dedicated screen
          to create or edit a group. Each group appears on the public home and
          experience pages.
        </p>
        {!isConfigured ? (
          <p className="mt-3 text-sm text-amber-200">
            Supabase is not configured, so submitting these forms will not
            persist changes yet.
          </p>
        ) : null}
        <div className="mt-5">
          <Link
            href="/dashboard/skills/new"
            className="inline-flex rounded-full bg-primary-container px-5 py-3 text-sm font-semibold text-on-primary"
          >
            New Skill Group
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/6 bg-surface-container-low">
        <table className="min-w-full divide-y divide-white/6">
          <thead className="bg-surface-container-high/60">
            <tr className="text-left text-xs uppercase tracking-[0.22em] text-on-surface-variant">
              <th className="px-6 py-4">Group</th>
              <th className="px-6 py-4">Icon</th>
              <th className="px-6 py-4">Highlight</th>
              <th className="px-6 py-4">Order</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/6">
            {skillGroups.map((group) => (
              <tr key={group.id} className="align-top">
                <td className="px-6 py-5">
                  <div className="font-medium text-primary">{group.title}</div>
                  <div className="mt-1 text-sm text-on-surface-variant">
                    {group.skills.length} skills
                  </div>
                  <div className="mt-2 text-sm leading-7 text-on-surface-variant">
                    {group.description || "No description yet."}
                  </div>
                </td>
                <td className="px-6 py-5 text-sm text-on-surface-variant">
                  {group.icon}
                </td>
                <td className="px-6 py-5 text-sm text-on-surface-variant">
                  {group.isHighlight ? "Yes" : "No"}
                </td>
                <td className="px-6 py-5 text-sm text-on-surface-variant">
                  {group.displayOrder}
                </td>
                <td className="px-6 py-5">
                  <Link
                    href={`/dashboard/skills/${group.id}`}
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
