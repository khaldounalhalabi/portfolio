import { ExperienceTimeline } from "@/components/portfolio/experience-timeline";
import { PortfolioIcon } from "@/components/portfolio/portfolio-icons";
import ExperienceService from "@/services/ExperienceService";
import SkillCategoryService from "@/services/SkillCategoryService";

export default async function ExperiencePage() {
  const experiences = await ExperienceService.make().all();
  const skillCategories = await SkillCategoryService.make().all(["skills"]);

  return (
    <main className="pt-20 pb-24">
      <section className="container-shell">
        <p className="text-xs tracking-[0.3em] text-secondary uppercase">
          Chronology
        </p>
        <h1 className="mt-5 font-heading text-5xl font-bold text-primary md:text-7xl">
          Experience
        </h1>
        <ExperienceTimeline experiences={experiences} />
      </section>

      <section id="skills" className="container-shell mt-20">
        <p className="text-xs tracking-[0.3em] text-secondary uppercase">
          Toolbox
        </p>
        <h2 className="mt-5 font-heading text-4xl font-bold text-primary md:text-6xl">
          Skills & Tech
        </h2>
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
      </section>
    </main>
  );
}
