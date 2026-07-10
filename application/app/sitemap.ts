import { MetadataRoute } from "next";

import { createClient } from "@/lib/supabase/server";
import ExperienceService from "@/services/ExperienceService";
import ProjectService from "@/services/ProjectService";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://khaldoun.site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const [projects, experiences] = await Promise.all([
    ProjectService.make().setClient(supabase).all(),
    ExperienceService.make().setClient(supabase).all(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/experience`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/resume.pdf`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteUrl}/projects/${project.slug}`,
    lastModified: project.updated_at ? new Date(project.updated_at) : new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Experience detail pages don't exist as standalone routes yet; the list page is already in staticRoutes
  return [...staticRoutes, ...projectRoutes];
}
