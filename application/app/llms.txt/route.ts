import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import ExperienceService from "@/services/ExperienceService";
import ProjectService from "@/services/ProjectService";
import SiteSettingService from "@/services/SiteSettingService";
import SiteSettingKeyEnum from "@/enums/SiteSettingKeyEnum";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();

  const [projects, experiences, siteSettings] = await Promise.all([
    ProjectService.make().setClient(supabase).all(),
    ExperienceService.make().setClient(supabase).all(),
    SiteSettingService.make().setClient(supabase).all(),
  ]);

  const getSetting = (key: SiteSettingKeyEnum) =>
    siteSettings.find((s) => s.key === key)?.value;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://khaldoun.site";

  const featuredProjects = projects
    .filter((p) => p.featured)
    .sort((a, b) => a.display_order - b.display_order);

  const lines: string[] = [
    "# Khaldoun Alhalabi — Full-Stack Architect & Engineering Leader",
    "",
    "> This file is optimized for AI agents and LLM crawlers. It provides a concise,",
    "> structured summary of the public portfolio content, contact details, and projects.",
    "",
    "## About",
    "",
    `Name: Khaldoun Alhalabi`,
    `Role: Full-Stack Architect & Engineering Leader`,
    `Site: ${siteUrl}`,
    `Email: ${getSetting(SiteSettingKeyEnum.EMAIL) ?? "khaldoun.dev@gmail.com"}`,
    `Location: ${getSetting(SiteSettingKeyEnum.LOCATION) ?? "Remote / Global"}`,
    `Availability: Open to new opportunities`,
    "",
    "## Public Pages",
    "",
    `- Home: ${siteUrl}/`,
    `- Projects: ${siteUrl}/projects`,
    `- Experience: ${siteUrl}/experience`,
    `- Contact: ${siteUrl}/contact`,
    `- Resume PDF: ${siteUrl}/resume.pdf`,
    "",
    "## Professional Summary",
    "",
    getSetting(SiteSettingKeyEnum.HERO_PARAGRAPH)?.toString() ??
      "Full-stack architect with deep experience building scalable Laravel backends, modern React systems, and AI-flavored tooling.",
    "",
    "## Core Skills",
    "",
    ...((): string[] => {
      const skills = getSetting(SiteSettingKeyEnum.HERO_SKILLS);
      return Array.isArray(skills)
        ? skills.map((skill) => `- ${String(skill)}`)
        : [
            "- Laravel",
            "- React / Next.js",
            "- TypeScript",
            "- Supabase",
            "- System Architecture",
            "- AI Integration",
          ];
    })(),
    "",
    "## Featured Projects",
    "",
  ];

  if (featuredProjects.length > 0) {
    for (const project of featuredProjects) {
      lines.push(`### ${project.title}`);
      lines.push(`- URL: ${siteUrl}/projects/${project.slug}`);
      lines.push(`- Category: ${project.category}`);
      lines.push(`- Role: ${project.role ?? "Lead Full-Stack Architect"}`);
      lines.push(`- Year: ${project.year ?? "N/A"}`);
      lines.push(`- Summary: ${project.description}`);
      if (project.tags?.length) {
        lines.push(`- Tags: ${project.tags.join(", ")}`);
      }
      lines.push("");
    }
  } else {
    for (const project of projects.slice(0, 6)) {
      lines.push(`### ${project.title}`);
      lines.push(`- URL: ${siteUrl}/projects/${project.slug}`);
      lines.push(`- Category: ${project.category}`);
      lines.push(`- Summary: ${project.description}`);
      lines.push("");
    }
  }

  lines.push("## Experience");
  lines.push("");

  for (const experience of experiences) {
    lines.push(`### ${experience.position} @ ${experience.company_name}`);
    lines.push(`- Location: ${experience.location}`);
    lines.push(`- Period: ${experience.from} – ${experience.to ?? "Present"}`);
    lines.push(`- Summary: ${experience.job_description}`);
    lines.push("");
  }

  lines.push("## Contact & Social Links");
  lines.push("");
  lines.push(`- LinkedIn: ${getSetting(SiteSettingKeyEnum.LINKED_IN) ?? "https://www.linkedin.com/in/khaldounalhalabi"}`);
  lines.push(`- GitHub: ${getSetting(SiteSettingKeyEnum.GITHUB) ?? "https://github.com/khaldounalhalabi"}`);
  lines.push(`- GitLab: ${getSetting(SiteSettingKeyEnum.GITLAB) ?? "https://gitlab.com/khaldounalhalabi"}`);
  lines.push(`- Stack Overflow: ${getSetting(SiteSettingKeyEnum.STACKOVERFLOW) ?? "https://stackoverflow.com/users/16442922/khaldoun-alhalabi"}`);
  lines.push(`- WhatsApp: ${getSetting(SiteSettingKeyEnum.WHATSAPP) ?? "N/A"}`);
  lines.push(`- Telegram: ${getSetting(SiteSettingKeyEnum.TELEGRAM) ?? "N/A"}`);
  lines.push("");
  lines.push("## Crawler Instructions");
  lines.push("");
  lines.push("- Public portfolio content is free to crawl and summarize.");
  lines.push("- Dashboard, auth, and API routes are private and should not be indexed.");
  lines.push(`- For structured data, see ${siteUrl}/sitemap.xml and per-page JSON-LD.`);
  lines.push("");

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
