"use client";

import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";
import { PortfolioIcon } from "@/components/portfolio/portfolio-icons";
import { cn } from "@/lib/utils";
import SkillCategory from "@/models/SkillCategory";

interface SkillsGridProps {
  skillCategories: SkillCategory[];
}

export function SkillsGrid({ skillCategories }: SkillsGridProps) {
  const total = skillCategories.length;
  // Number of items left over in the final row at each breakpoint.
  const remainderMd = total % 2; // 2 cards per row from md
  const remainderXl = total % 3; // 3 cards per row from xl

  return (
    <StaggerContainer
      className="mt-12 grid grid-cols-1 gap-px border border-border bg-border md:grid-cols-6"
      staggerDelay={0.06}
    >
      {skillCategories.map((group, index) => {
        const isLast = index === total - 1;
        const isSecondLast = index === total - 2;

        // The grid has 6 tracks from `md`. A full row is 3 spans (md, 2/row) or
        // 2 spans (xl, 3/row). When the last row is short, stretch its cards so
        // they fill the whole width instead of leaving empty bordered cells.
        const mdSpan =
          remainderMd === 1 && isLast ? "md:col-span-6" : "md:col-span-3";

        let xlSpan = "xl:col-span-2";
        if (remainderXl === 1 && isLast) {
          xlSpan = "xl:col-span-6";
        } else if (remainderXl === 2 && (isLast || isSecondLast)) {
          xlSpan = "xl:col-span-3";
        }

        return (
          <StaggerItem
            key={group.id}
            className={cn("h-full", mdSpan, xlSpan)}
          >
            <div
              className={cn(
                "group flex h-full flex-col bg-background p-7 transition-colors duration-300 hover:bg-surface-container-low",
                group.is_highlighted && "bg-surface-container-low/60",
              )}
            >
              <div className="flex items-center justify-between">
                <PortfolioIcon
                  name={group.icon}
                  className="h-5 w-5 text-foreground"
                />
                {group.is_highlighted && (
                  <span className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
                    Core
                  </span>
                )}
              </div>
              <h3 className="mt-6 font-heading text-xl font-semibold text-foreground">
                {group.name}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {group.description}
              </p>
              {group.skills && group.skills.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-x-3 gap-y-1.5 border-t border-border pt-5">
                  {group.skills.map((skill) => (
                    <span
                      key={skill.name}
                      className="font-mono text-xs text-muted-foreground transition-colors group-hover:text-foreground"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </StaggerItem>
        );
      })}
    </StaggerContainer>
  );
}
