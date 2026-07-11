"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { ProjectMedia } from "@/components/portfolio/project-media";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { stripRichText } from "@/lib/rich-text";
import { cn } from "@/lib/utils";
import Project from "@/models/Project";

interface ProjectsExplorerProps {
  projects: Project[];
}

export function ProjectsExplorer({ projects }: ProjectsExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);

  const categories = useMemo(
    () => ["All", ...new Set(projects.map((project) => project.category))],
    [projects],
  );

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "All") return projects;
    return projects.filter((project) => project.category === selectedCategory);
  }, [projects, selectedCategory]);

  const countFor = (category: string) =>
    category === "All"
      ? projects.length
      : projects.filter((p) => p.category === category).length;

  const handleSelect = (category: string) => {
    setSelectedCategory(category);
    setFilterOpen(false);
  };

  return (
    <div>
      <motion.div
        layout
        className="container-shell grid grid-cols-1 gap-x-8 gap-y-14 pt-4 md:grid-cols-2"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{
                duration: 0.45,
                delay: index * 0.04,
                ease: [0.22, 1, 0.36, 1],
                layout: { duration: 0.4 },
              }}
            >
              <Link href={`/projects/${project.slug}`} className="group block">
                <div className="relative aspect-16/10 overflow-hidden border border-border">
                  <ProjectMedia
                    className="grayscale transition duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
                    imageUrl={project.image_url}
                    title={project.title}
                  />
                </div>
                <div className="mt-5">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="font-mono text-xs tracking-wide text-muted-foreground">
                      {project.category}
                      {project.year ? ` — ${project.year}` : ""}
                    </p>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                  </div>
                  <h3 className="mt-2 font-heading text-2xl font-semibold text-foreground">
                    {project.title}
                  </h3>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {stripRichText(project.description)}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1">
                    {project.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-xs text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 4 && (
                      <span className="font-mono text-xs text-muted-foreground">
                        +{project.tags.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredProjects.length === 0 && (
        <div className="container-shell py-20 text-center">
          <p className="font-mono text-sm text-muted-foreground">
            No projects in this category yet.
          </p>
        </div>
      )}

      {/* Floating filter — one small button regardless of category count. */}
      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            className="group fixed bottom-6 left-1/2 z-40 inline-flex -translate-x-1/2 items-center gap-3 border border-border bg-background/90 py-3 pr-3 pl-5 font-mono text-sm text-foreground shadow-[0_8px_30px_-12px_rgba(0,0,0,0.7)] backdrop-blur-md transition-colors hover:bg-surface-container-low"
            aria-label="Filter projects by category"
          >
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
            <span className="max-w-[40vw] truncate">{selectedCategory}</span>
            <span className="border border-border px-2 py-0.5 text-xs text-muted-foreground tabular-nums">
              {filteredProjects.length}
            </span>
          </button>
        </SheetTrigger>

        <SheetContent
          side="bottom"
          className="max-h-[80vh] w-full overflow-y-auto border-t border-border bg-background p-0 data-[side=bottom]:sm:max-w-none"
        >
          <SheetHeader className="border-b border-border p-6 md:px-10">
            <SheetTitle className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
              Filter by category
            </SheetTitle>
          </SheetHeader>

          <div className="container-shell grid grid-cols-2 gap-px bg-border py-px sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleSelect(category)}
                  className={cn(
                    "group flex items-center justify-between gap-3 bg-background px-5 py-4 text-left transition-colors hover:bg-surface-container-low",
                    active && "bg-surface-container-low",
                  )}
                >
                  <span className="min-w-0">
                    <span
                      className={cn(
                        "block truncate font-mono text-sm",
                        active ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {category}
                    </span>
                    <span className="mt-0.5 block font-mono text-[10px] text-muted-foreground tabular-nums">
                      {countFor(category)} project
                      {countFor(category) === 1 ? "" : "s"}
                    </span>
                  </span>
                  {active && (
                    <Check className="h-4 w-4 shrink-0 text-foreground" />
                  )}
                </button>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
