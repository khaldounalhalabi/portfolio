import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { PortfolioIcon } from "@/components/portfolio/portfolio-icons";
import { FeaturedProjectsCarousel } from "@/components/portfolio/featured-projects-carousel";
import SiteSettingKeyEnum from "@/enums/SiteSettingKeyEnum";
import ProjectService from "@/services/ProjectService";
import SiteSettingService from "@/services/SiteSettingService";
import SkillCategoryService from "@/services/SkillCategoryService";

export default async function HomePage() {
  const projects = await ProjectService.make().all();
  const featuredProjects = projects
    .filter((project) => project.featured)
    .sort((a, b) => a.display_order - b.display_order);

  const siteSettings = await SiteSettingService.make().all();
  const skillCategories = await SkillCategoryService.make().all(["skills"]);

  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-fade opacity-70" />
        <div className="absolute top-24 left-0 h-80 w-80 rounded-full bg-primary-container/10 blur-[120px]" />
        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-secondary/10 blur-[120px]" />
        <div className="relative container-shell flex min-h-[calc(100vh-84px)] flex-col justify-center py-20">
          <div className="inline-flex w-fit items-center gap-3 rounded-full border border-white/10 bg-surface-container-low px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-secondary" />
            <span className="text-xs tracking-[0.25em] text-secondary uppercase">
              Available for new opportunities
            </span>
          </div>
          <h1 className="mt-8 max-w-5xl font-heading text-5xl font-bold tracking-tight text-primary md:text-7xl lg:text-8xl">
            Khaldoun Alhalabi
            <span className="text-glow mt-3 block bg-linear-to-r from-primary to-primary-container bg-clip-text text-transparent">
              {
                siteSettings.find(
                  (s) => s.key == SiteSettingKeyEnum.HERO_SENTENCE_UNDER_NAME,
                )?.value
              }
            </span>
          </h1>
          <div className="mt-8 flex flex-wrap gap-4 text-xs tracking-[0.3em] text-on-surface-variant uppercase md:text-sm">
            {siteSettings
              .find((s) => s.key == SiteSettingKeyEnum.HERO_SKILLS)
              ?.value.map((skill, index) => (
                <span key={index}>{skill}</span>
              ))}
          </div>
          <div className="mt-8 max-w-3xl text-lg leading-8 text-on-surface-variant md:text-xl">
            <div
              dangerouslySetInnerHTML={{
                __html:
                  siteSettings.find(
                    (s) => s.key == SiteSettingKeyEnum.HERO_PARAGRAPH,
                  )?.value ?? "",
              }}
            />
          </div>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center rounded-full bg-secondary-fixed-dim px-7 py-4 font-semibold text-on-secondary"
            >
              Explore My Work
            </Link>
            <Link
              href="/experience"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-7 py-4 font-semibold text-primary"
            >
              View Technical Skills
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {featuredProjects.length > 0 && (
        <FeaturedProjectsCarousel projects={featuredProjects} />
      )}

      <section className="py-24">
        <div className="container-shell">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-xs tracking-[0.3em] text-secondary uppercase">
                Toolbox
              </p>
              <h2 className="mt-4 font-heading text-4xl font-bold text-primary">
                Skills that translate into shipped systems
              </h2>
            </div>
            <Link
              href="/experience"
              className="hidden text-sm font-semibold text-primary-container md:inline"
            >
              Open full experience
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {skillCategories.map((group) => (
              <div
                key={group.id}
                className={`rounded-[2rem] border p-6 ${
                  group.is_highlighted
                    ? "border-primary-container/30 bg-surface-container"
                    : "border-white/6 bg-surface-container-low"
                }`}
              >
                <PortfolioIcon
                  name={group.icon}
                  className={`h-6 w-6 ${
                    group.is_highlighted
                      ? "text-primary-container"
                      : "text-secondary"
                  }`}
                />
                <h3 className="mt-4 font-heading text-2xl font-bold text-primary">
                  {group.name}
                </h3>
                <p className="mt-3 text-sm leading-7 text-on-surface-variant">
                  {group.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {group.skills?.map((skill) => (
                    <span
                      key={skill.name}
                      className="rounded-full bg-surface-container-high px-3 py-1 text-xs text-on-surface-variant"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
