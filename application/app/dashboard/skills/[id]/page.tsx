import Link from "next/link";
import { notFound } from "next/navigation";

import { SkillEditorCard } from "@/components/dashboard/skill-editor";
import { getPortfolioData } from "@/lib/portfolio/queries";

export default async function DashboardEditSkillPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { skillGroups } = await getPortfolioData();
  const group = skillGroups.find((item) => item.id === id);

  if (!group) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/6 bg-surface-container-low p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-primary">
              Edit Skill Group
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-on-surface-variant">
              Update the group details, ordering, and highlighted state for
              <span className="text-primary"> {group.title}</span>.
            </p>
          </div>
          <Link
            href="/dashboard/skills"
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-primary"
          >
            Back to Skills
          </Link>
        </div>
      </div>

      <SkillEditorCard group={group} />
    </div>
  );
}
