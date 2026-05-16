import Link from "next/link";

import { SkillCreateForm } from "@/components/dashboard/skill-editor";

export default function DashboardNewSkillPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/6 bg-surface-container-low p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-primary">
              New Skill Group
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-on-surface-variant">
              Create a skill cluster for the public home and experience pages.
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

      <SkillCreateForm />
    </div>
  );
}
