"use client";

import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";
import { PortfolioIcon } from "@/components/portfolio/portfolio-icons";
import SkillCategory from "@/models/SkillCategory";

interface SkillsGridProps {
  skillCategories: SkillCategory[];
}

export function SkillsGrid({ skillCategories }: SkillsGridProps) {
  return (
    <StaggerContainer
      className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4"
      staggerDelay={0.08}
    >
      {skillCategories.map((group) => (
        <StaggerItem key={group.id} className="h-full">
          <div
            className={`group h-full rounded-[2rem] border p-6 transition-all duration-500 hover:-translate-y-1 ${
              group.is_highlighted
                ? "border-primary-container/30 bg-surface-container hover:border-primary-container/50 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.35),0_0_30px_-10px_rgba(0,245,255,0.1)]"
                : "border-white/6 bg-surface-container-low hover:border-white/15 hover:bg-surface-container"
            }`}
          >
            <div
              className={`inline-flex rounded-2xl bg-surface-container-high p-3 transition-transform duration-300 group-hover:scale-110 ${
                group.is_highlighted
                  ? "text-primary-container"
                  : "text-secondary"
              }`}
            >
              <PortfolioIcon name={group.icon} className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-heading text-2xl font-bold text-primary">
              {group.name}
            </h3>
            <p className="mt-3 text-sm leading-7 text-on-surface-variant">
              {group.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {group.skills?.map((skill) => (
                <span
                  key={skill.name}
                  className="rounded-full bg-surface-container-high px-3 py-1 text-xs text-on-surface-variant transition-colors group-hover:bg-surface-container-highest"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
