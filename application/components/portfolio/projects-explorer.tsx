"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { ProjectMedia } from "@/components/portfolio/project-media";
import { stripRichText } from "@/lib/rich-text";
import Project from "@/models/Project";

interface ProjectsExplorerProps {
  projects: Project[];
}

export function ProjectsExplorer({ projects }: ProjectsExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState("All Projects");

  const categories = useMemo(
    () => [
      "All Projects",
      ...new Set(projects.map((project) => project.category)),
    ],
    [projects],
  );

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "All Projects") {
      return projects;
    }

    return projects.filter((project) => project.category === selectedCategory);
  }, [projects, selectedCategory]);

  return (
    <div>
      <div className="sticky top-18.25 z-30 border-y border-white/5 bg-background/80 py-4 backdrop-blur-xl">
        <div className="container-shell flex flex-wrap gap-3 pb-1">
          {categories.slice(0, 15).map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`relative rounded-full px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? "text-on-primary"
                  : "bg-surface-container-high text-on-surface-variant hover:text-primary"
              }`}
            >
              {selectedCategory === category && (
                <motion.span
                  layoutId="activeCategory"
                  className="absolute inset-0 rounded-full bg-primary-container"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{category}</span>
            </button>
          ))}
        </div>
      </div>

      <motion.div
        layout
        className="container-shell grid gap-8 pt-10 md:grid-cols-2 xl:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              layout
              className="h-full"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
                layout: { duration: 0.4 },
              }}
            >
              <Link
                href={`/projects/${project.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/6 bg-surface-container-low transition-all duration-500 hover:-translate-y-1 hover:border-primary-container/20 hover:shadow-[0_25px_50px_-15px_rgba(0,0,0,0.4),0_0_30px_-10px_rgba(0,245,255,0.08)]"
              >
                <div className="relative aspect-16/10 overflow-hidden">
                  <ProjectMedia
                    className="transition duration-700 group-hover:scale-105"
                    imageUrl={project.image_url}
                    title={project.title}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center bg-primary-container/0 transition-colors duration-500 group-hover:bg-primary-container/5">
                    <span className="flex h-12 w-12 -translate-y-4 scale-75 items-center justify-center rounded-full bg-background/80 text-primary opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
                      <ArrowUpRight className="h-5 w-5" />
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col space-y-5 p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs tracking-[0.25em] text-secondary uppercase">
                        {project.category}
                      </p>
                      <h3 className="mt-3 font-heading text-2xl font-bold text-primary transition-colors group-hover:text-primary-container">
                        {project.title}
                      </h3>
                    </div>
                    <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-primary-container opacity-0 transition-all group-hover:opacity-100" />
                  </div>
                  <p className="line-clamp-3 flex-1 text-sm leading-7 text-on-surface-variant">
                    {stripRichText(project.description)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-surface-container-high px-3 py-1 text-xs tracking-[0.15em] text-secondary uppercase transition-colors group-hover:bg-surface-container"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 4 && (
                      <span className="rounded-full bg-surface-container-high px-3 py-1 text-xs text-on-surface-variant">
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
    </div>
  );
}
