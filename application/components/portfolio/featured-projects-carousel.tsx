"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { ProjectMedia } from "@/components/portfolio/project-media";
import Project from "@/models/Project";

interface FeaturedProjectsCarouselProps {
  projects: Project[];
}

const FADE_DURATION_MS = 500;
const SLIDE_DURATION_MS = 5000;

export function FeaturedProjectsCarousel({
  projects,
}: FeaturedProjectsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (projects.length <= 1) {
      return;
    }

    let fadeTimeout: ReturnType<typeof setTimeout> | null = null;

    const interval = setInterval(() => {
      setIsVisible(false);

      fadeTimeout = setTimeout(() => {
        setCurrentIndex((previous) => (previous + 1) % projects.length);
        setIsVisible(true);
      }, FADE_DURATION_MS);
    }, SLIDE_DURATION_MS);

    return () => {
      clearInterval(interval);
      if (fadeTimeout) {
        clearTimeout(fadeTimeout);
      }
    };
  }, [projects.length]);

  const project = projects[currentIndex];

  return (
    <section className="border-y border-white/5 bg-surface-container-low py-24">
      <div className="container-shell grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
        <div>
          <p className="text-xs tracking-[0.3em] text-secondary uppercase">
            Featured System
          </p>
          <h2 className="mt-5 max-w-xl font-heading text-4xl font-bold text-primary md:text-5xl">
            Building at the edge of performance.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-on-surface-variant">
            My architecture approach combines dependable backend design,
            maintainable admin surfaces, and clean interaction design.
          </p>
          <div
            className={`mt-8 transition-opacity duration-500 ease-in-out ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="flex flex-wrap gap-3">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-surface-container-high px-3 py-1 text-xs tracking-[0.25em] text-secondary uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>
            <Link
              href={`/projects/${project.slug}`}
              className="mt-8 inline-flex items-center gap-2 font-semibold text-primary-container"
            >
              Open featured case study
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <Link
          href={`/projects/${project.slug}`}
          className={`group relative block overflow-hidden rounded-[2rem] border border-white/5 transition-opacity duration-500 ease-in-out ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="relative aspect-video">
            <div className="transition duration-700 group-hover:scale-105">
              <ProjectMedia
                imageUrl={project.image_url}
                title={project.title}
              />
            </div>
            <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent" />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-8">
            <p className="text-xs tracking-[0.3em] text-secondary uppercase">
              {project.category}
            </p>
            <h3 className="mt-3 font-heading text-3xl font-bold text-primary">
              {project.title}
            </h3>
          </div>
        </Link>
      </div>
    </section>
  );
}
