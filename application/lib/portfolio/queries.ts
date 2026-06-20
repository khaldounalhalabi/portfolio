import "server-only";

import { format } from "date-fns";
import { unstable_noStore as noStore } from "next/cache";

import { Tables } from "@/integrations/supabase/database.types";
import {
  createSupabaseServerClient,
  hasSupabaseServerEnv,
} from "@/integrations/supabase/server";
import {
  defaultContactInfo,
  defaultContactLinks,
  defaultExperience,
  defaultPortfolioData,
  defaultProjects,
  defaultSkillGroups,
} from "@/lib/portfolio/default-content";
import type {
  ContactInfo,
  ContactLink,
  ExperienceItem,
  PortfolioData,
  Project,
  ProjectTech,
  SkillGroup,
} from "@/lib/portfolio/types";

const PROJECT_IMAGES_BUCKET = "portfolio-images";

type ProjectRow = Tables<"projects">;
type SkillGroupRow = Tables<"skill_groups">;
type ContactInfoRow = Tables<"contact_info">;
type ContactLinkRow = Tables<"contact_links">;
type ExperienceRow = Tables<"experiences">;

function getProjectImageUrl(imagePath: string | null) {
  if (!imagePath) {
    return null;
  }

  const supabase = createSupabaseServerClient();
  const { data } = supabase.storage
    .from(PROJECT_IMAGES_BUCKET)
    .getPublicUrl(imagePath);

  return data.publicUrl;
}

function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    longDescription: row.long_description,
    imagePath: row.image_path,
    imageUrl: getProjectImageUrl(row.image_path),
    tags: row.tags ?? [],
    category: row.category,
    role: row.role,
    year: row.year,
    problem: row.problem,
    solution: row.solution,
    features: row.features ?? [],
    techStack: (row.tech_stack as ProjectTech[] | null) ?? [],
    featured: row.featured ?? false,
    displayOrder: row.display_order ?? 0,
  };
}

function mapSkillGroup(row: SkillGroupRow): SkillGroup {
  return {
    id: row.id,
    title: row.title,
    icon: row.icon,
    skills: row.skills ?? [],
    description: row.description,
    isHighlight: row.is_highlight ?? false,
    displayOrder: row.display_order ?? 0,
  };
}

function mapContactInfo(row: ContactInfoRow): ContactInfo {
  return {
    id: row.id,
    email: row.email,
    phone: row.phone,
    location: row.location,
    intro: row.intro,
    availability: row.availability,
    resumeLabel: row.resume_label,
    resumeUrl: row.resume_url,
  };
}

function mapContactLink(row: ContactLinkRow): ContactLink {
  return {
    id: row.id,
    label: row.label,
    url: row.url,
    icon: row.icon,
    displayOrder: row.display_order ?? 0,
  };
}

function formatExperiencePeriod(row: Pick<ExperienceRow, "from" | "to">) {
  const from = format(new Date(row.from), "MMM yyyy");
  const to = row.to ? format(new Date(row.to), "MMM yyyy") : "Present";

  return `${from} - ${to}`;
}

function mapExperience(row: ExperienceRow): ExperienceItem {
  return {
    id: row.id,
    company: row.company_name,
    role: row.position,
    period: formatExperiencePeriod(row),
    description: row.job_description,
    tags: [row.location].filter(Boolean),
    isCurrent: !row.to,
    companyDescription: row.company_description,
    companyWebsite: row.company_website,
    from: row.from,
    location: row.location,
    to: row.to,
  };
}

async function fetchPortfolioDataFromSupabase(): Promise<PortfolioData> {
  const supabase = createSupabaseServerClient();

  const [
    projectsResult,
    skillsResult,
    contactInfoResult,
    contactLinksResult,
    experiencesResult,
  ] = await Promise.all([
    supabase
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true }),
    supabase
      .from("skill_groups")
      .select("*")
      .order("display_order", { ascending: true }),
    supabase.from("contact_info").select("*").eq("id", "primary").single(),
    supabase
      .from("contact_links")
      .select("*")
      .order("display_order", { ascending: true }),
    supabase
      .from("experiences")
      .select("*")
      .order("from", { ascending: false }),
  ]);

  if (projectsResult.error) {
    throw projectsResult.error;
  }
  if (skillsResult.error) {
    throw skillsResult.error;
  }
  if (contactInfoResult.error) {
    throw contactInfoResult.error;
  }
  if (contactLinksResult.error) {
    throw contactLinksResult.error;
  }
  if (experiencesResult.error) {
    throw experiencesResult.error;
  }

  return {
    projects: projectsResult.data?.map(mapProject) ?? defaultProjects,
    experience: experiencesResult.data?.map(mapExperience) ?? defaultExperience,
    skillGroups: skillsResult.data?.map(mapSkillGroup) ?? defaultSkillGroups,
    contactInfo: contactInfoResult.data
      ? mapContactInfo(contactInfoResult.data)
      : defaultContactInfo,
    contactLinks:
      contactLinksResult.data?.map(mapContactLink) ?? defaultContactLinks,
  };
}

export async function getPortfolioData() {
  noStore();

  if (!hasSupabaseServerEnv()) {
    return defaultPortfolioData;
  }

  try {
    return await fetchPortfolioDataFromSupabase();
  } catch {
    return defaultPortfolioData;
  }
}

export async function getProjectBySlug(slug: string) {
  const portfolio = await getPortfolioData();
  return portfolio.projects.find((project) => project.slug === slug) ?? null;
}

export async function getDashboardSummary() {
  const portfolio = await getPortfolioData();

  return {
    projectCount: portfolio.projects.length,
    featuredProjectCount: portfolio.projects.filter(
      (project) => project.featured,
    ).length,
    skillCount: portfolio.skillGroups.reduce(
      (total, group) => total + group.skills.length,
      0,
    ),
    linkCount: portfolio.contactLinks.length,
  };
}
