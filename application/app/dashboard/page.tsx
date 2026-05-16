import Link from "next/link";

import { hasSupabaseServerEnv } from "@/integrations/supabase/server";
import { getDashboardSummary, getPortfolioData } from "@/lib/portfolio/queries";

export default async function DashboardPage() {
  const summary = await getDashboardSummary();
  const portfolio = await getPortfolioData();
  const isConfigured = hasSupabaseServerEnv();

  return (
    <div className="space-y-6">
      {!isConfigured ? (
        <div className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-5 text-sm text-amber-100">
          Supabase environment variables are missing. The dashboard is rendering
          fallback seed content, but edits will not persist until
          `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and
          `SUPABASE_SERVICE_ROLE_KEY` are configured.
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Projects", value: summary.projectCount },
          { label: "Featured", value: summary.featuredProjectCount },
          { label: "Skills", value: summary.skillCount },
          { label: "Links", value: summary.linkCount },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-3xl border border-white/6 bg-surface-container-low p-6"
          >
            <p className="text-xs uppercase tracking-[0.25em] text-secondary">
              {item.label}
            </p>
            <p className="mt-4 font-heading text-4xl font-bold text-primary">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-white/6 bg-surface-container-low p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-secondary">
            Quick Links
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              {
                href: "/dashboard/projects",
                title: "Manage Projects",
                body: "Edit case studies, tags, ordering, and featured status.",
              },
              {
                href: "/dashboard/skills",
                title: "Manage Skills",
                body: "Control skill groups and highlighted technology clusters.",
              },
              {
                href: "/dashboard/contact",
                title: "Manage Contact",
                body: "Update direct contact details, intro copy, and social links.",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-white/6 bg-surface-container-high p-5 hover:border-primary-container/30"
              >
                <h2 className="font-heading text-xl font-bold text-primary">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-on-surface-variant">
                  {item.body}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/6 bg-surface-container-low p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-secondary">
            Public Snapshot
          </p>
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl bg-surface-container-high p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-on-surface-variant">
                Contact Email
              </p>
              <p className="mt-2 text-primary">{portfolio.contactInfo.email}</p>
            </div>
            <div className="rounded-2xl bg-surface-container-high p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-on-surface-variant">
                Featured Project
              </p>
              <p className="mt-2 text-primary">
                {portfolio.projects.find((project) => project.featured)?.title ??
                  "No featured project set"}
              </p>
            </div>
            <div className="rounded-2xl bg-surface-container-high p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-on-surface-variant">
                Public Availability
              </p>
              <p className="mt-2 text-primary">{portfolio.contactInfo.availability}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
