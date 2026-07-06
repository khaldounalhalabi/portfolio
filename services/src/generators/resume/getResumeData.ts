import { format, parseISO } from "date-fns";
import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "../../types/database.types.js";

import { SiteSettingKeyEnum } from "./SiteSettingKeyEnum.js";
import { sanitizeRichText, stripRichText } from "./rich-text.js";
import type {
  ResumeContact,
  ResumeData,
  ResumeExperience,
  ResumeProject,
  ResumeProjectTechStackItem,
  ResumeSkillGroup,
} from "./types.js";

type TypedSupabase = SupabaseClient<Database>;
type SiteSettingRow = Database["public"]["Tables"]["site_settings"]["Row"];
type ExperienceRow = Database["public"]["Tables"]["experiences"]["Row"];
type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
type SkillCategoryRow = Database["public"]["Tables"]["skill_categories"]["Row"];
type SkillRow = Database["public"]["Tables"]["skills"]["Row"];

const RESUME_SETTING_KEYS: SiteSettingKeyEnum[] = [
  SiteSettingKeyEnum.HERO_SENTENCE_UNDER_NAME,
  SiteSettingKeyEnum.HERO_PARAGRAPH,
  SiteSettingKeyEnum.EMAIL,
  SiteSettingKeyEnum.PHONE,
  SiteSettingKeyEnum.LOCATION,
  SiteSettingKeyEnum.LINKED_IN,
  SiteSettingKeyEnum.GITHUB,
  SiteSettingKeyEnum.GITLAB,
  SiteSettingKeyEnum.STACKOVERFLOW,
  SiteSettingKeyEnum.TELEGRAM,
  SiteSettingKeyEnum.WHATSAPP,
  SiteSettingKeyEnum.LANGUAGES,
  SiteSettingKeyEnum.EDUCATION,
  SiteSettingKeyEnum.RESUME_TITLE,
];

function getSettingValue(
  settings: SiteSettingRow[],
  key: SiteSettingKeyEnum,
): string | undefined {
  const setting = settings.find((s) => s.key === key);

  if (!setting) {
    return undefined;
  }

  return Array.isArray(setting.value)
    ? setting.value.join(", ")
    : String(setting.value);
}

function formatDateRange(from: string, to: string | null): string {
  const fromDate = parseISO(from);
  const toDate = to ? parseISO(to) : null;

  const fromFormatted = format(fromDate, "MM/yyyy");
  const toFormatted = toDate ? format(toDate, "MM/yyyy") : "Present";

  return `${fromFormatted} - ${toFormatted}`;
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/&#47;/g, "/");
}

function sanitizeResumeHtml(value: string | null | undefined): string {
  return sanitizeRichText(decodeHtmlEntities(value ?? ""));
}

function parseTechStack(value: unknown): ResumeProjectTechStackItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is ResumeProjectTechStackItem =>
        typeof item === "object" &&
        item !== null &&
        "name" in item &&
        typeof item.name === "string" &&
        item.name.trim().length > 0,
    )
    .map((item) => ({
      name: item.name.trim(),
      icon: typeof item.icon === "string" ? item.icon.trim() : "",
      description:
        typeof item.description === "string" ? item.description.trim() : "",
    }));
}

export async function getResumeData(
  supabase: TypedSupabase,
): Promise<ResumeData> {
  const [settingsResult, experiencesResult, projectsResult, skillCategoriesResult] =
    await Promise.all([
      supabase
        .from("site_settings")
        .select("*")
        .in("key", RESUME_SETTING_KEYS),
      supabase.from("experiences").select("*"),
      supabase.from("projects").select("*"),
      supabase.from("skill_categories").select("*, skills(*)"),
    ]);

  if (settingsResult.error) throw settingsResult.error;
  if (experiencesResult.error) throw experiencesResult.error;
  if (projectsResult.error) throw projectsResult.error;
  if (skillCategoriesResult.error) throw skillCategoriesResult.error;

  const settings = settingsResult.data as SiteSettingRow[];
  const experiences = experiencesResult.data as ExperienceRow[];
  const projects = projectsResult.data as ProjectRow[];
  const skillCategories = skillCategoriesResult.data as (SkillCategoryRow & {
    skills: SkillRow[] | null;
  })[];

  const contact: ResumeContact = {
    email: getSettingValue(settings, SiteSettingKeyEnum.EMAIL),
    phone: getSettingValue(settings, SiteSettingKeyEnum.PHONE),
    location: getSettingValue(settings, SiteSettingKeyEnum.LOCATION),
    linkedIn: getSettingValue(settings, SiteSettingKeyEnum.LINKED_IN),
    github: getSettingValue(settings, SiteSettingKeyEnum.GITHUB),
    gitlab: getSettingValue(settings, SiteSettingKeyEnum.GITLAB),
    stackoverflow: getSettingValue(settings, SiteSettingKeyEnum.STACKOVERFLOW),
    telegram: getSettingValue(settings, SiteSettingKeyEnum.TELEGRAM),
    whatsapp: getSettingValue(settings, SiteSettingKeyEnum.WHATSAPP),
  };

  const mappedExperiences: ResumeExperience[] = experiences.map(
    (experience) => ({
      id: experience.id,
      position: experience.position,
      companyName: experience.company_name,
      location: experience.location,
      dateRange: formatDateRange(experience.from, experience.to),
      jobDescription: sanitizeResumeHtml(experience.job_description),
    }),
  );

  const mappedProjects: ResumeProject[] = projects
    .filter((project) => project.featured)
    .sort((a, b) => a.display_order - b.display_order)
    .map((project) => ({
      id: project.id,
      title: project.title,
      description: project.description,
      role: project.role,
      year: project.year,
      employer: project.employer,
      projectUrl: project.project_url,
      techStack: parseTechStack(project.tech_stack),
    }));

  const mappedSkillGroups: ResumeSkillGroup[] = [...skillCategories]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((category) => ({
      category: category.name,
      skills:
        category.skills
          ?.map((skill) => skill.name)
          .filter(Boolean)
          .sort() ?? [],
    }));

  return {
    name: "Khaldoun Alhalabi",
    title:
      getSettingValue(settings, SiteSettingKeyEnum.RESUME_TITLE) ??
      getSettingValue(settings, SiteSettingKeyEnum.HERO_SENTENCE_UNDER_NAME) ??
      "",
    summary: stripRichText(
      getSettingValue(settings, SiteSettingKeyEnum.HERO_PARAGRAPH),
    ),
    contact,
    experiences: mappedExperiences,
    projects: mappedProjects,
    skillGroups: mappedSkillGroups,
    languages: getSettingValue(settings, SiteSettingKeyEnum.LANGUAGES),
    education: sanitizeResumeHtml(
      getSettingValue(settings, SiteSettingKeyEnum.EDUCATION),
    ),
  };
}
