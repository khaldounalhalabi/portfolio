import Link from "next/link";

import { ProjectCreateForm } from "@/components/dashboard/project-editor";

export default function DashboardNewProjectPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/6 bg-surface-container-low p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-primary">
              New Project
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-on-surface-variant">
              Create the project shell here, then continue refining the case
              study content from its edit page after the first save.
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

      <ProjectCreateForm />
    </div>
  );
}
