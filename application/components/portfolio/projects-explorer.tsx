"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { ProjectMedia } from "@/components/portfolio/project-media";
import { stripRichText } from "@/lib/rich-text";
import Project from "@/models/Project";

export function ProjectsExplorer({ projects }: { projects: Project[] }) {
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
      <div className="sticky top-20 z-30 mb-10 border-y border-white/5 bg-background/80 py-4 backdrop-blur-xl">
        <div className="container-shell flex gap-3 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-5 py-2 text-sm font-semibold whitespace-nowrap ${
                selectedCategory === category
                  ? "bg-primary-container text-on-primary"
                  : "bg-surface-container-high text-on-surface-variant hover:text-primary"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="container-shell grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {filteredProjects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.slug}`}
            className="group overflow-hidden rounded-3xl border border-white/6 bg-surface-container-low"
          >
            <div className="relative aspect-16/10 overflow-hidden">
              <div className="transition duration-700 group-hover:scale-105">
                <ProjectMedia imageUrl={project.image_url} title={project.title} />
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-background via-background/10 to-transparent" />
            </div>
            <div className="space-y-5 p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-secondary">
                    {project.category}
                  </p>
                  <h3 className="mt-3 font-heading text-2xl font-bold text-primary">
                    {project.title}
                  </h3>
                </div>
                <ArrowUpRight className="mt-1 h-5 w-5 text-primary-container opacity-0 transition group-hover:opacity-100" />
              </div>
              <p className="text-sm leading-7 text-on-surface-variant">
                {stripRichText(project.description)}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-surface-container-high px-3 py-1 text-xs uppercase tracking-[0.2em] text-secondary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
