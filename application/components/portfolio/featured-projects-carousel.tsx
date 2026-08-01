"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { ProjectMedia } from "@/components/portfolio/project-media";
import Project from "@/models/Project";

interface FeaturedProjectsCarouselProps {
  projects: Project[];
}

const SLIDE_DURATION_MS = 6000;

export function FeaturedProjectsCarousel({
  projects,
}: FeaturedProjectsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const go = useCallback(
    (index: number) => {
      const next = (index + projects.length) % projects.length;
      setCurrentIndex(next);
    },
    [projects.length],
  );

  useEffect(() => {
    if (projects.length <= 1) return;
    const interval = setInterval(
      () => setCurrentIndex((p) => (p + 1) % projects.length),
      SLIDE_DURATION_MS,
    );
    return () => clearInterval(interval);
  }, [projects.length]);

  return (
    <section id="featured" className="border-t border-border">
      <div className="container-shell py-20 md:py-28">
        <div className="flex items-baseline justify-between gap-6">
          <div className="flex items-baseline gap-4">
            <span className="font-mono text-xs text-muted-foreground tabular-nums">
              01
            </span>
            <h2 className="font-heading text-sm font-medium tracking-wide text-foreground uppercase">
              Featured work
            </h2>
          </div>
          <Link
            href="/projects"
            className="hidden font-mono text-xs text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            All projects ↗
          </Link>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="relative order-2 lg:order-1">
            {/*
              All slides render in the DOM so every featured project's text is
              present in the server HTML for crawlers / no-JS clients. Only the
              active slide is visible; inactive slides are faded out and made
              non-interactive via CSS rather than unmounted.
            */}
            <div className="grid">
              {projects.map((item, index) => {
                const active = index === currentIndex;
                return (
                  <motion.div
                    key={item.id}
                    className="[grid-area:1/1]"
                    animate={{ opacity: active ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    aria-hidden={!active}
                    inert={!active ? true : undefined}
                  >
                    <p className="font-mono text-xs tracking-wide text-muted-foreground">
                      {item.category}
                      {item.year ? ` — ${item.year}` : ""}
                    </p>
                    <h3 className="mt-4 font-heading text-3xl font-semibold text-foreground md:text-4xl">
                      {item.title}
                    </h3>
                    <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
                      {item.tags.slice(0, 5).map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-xs text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/projects/${item.slug}`}
                      className="group mt-8 inline-flex items-center gap-2 font-mono text-sm text-foreground"
                    >
                      <span className="border-b border-border pb-0.5 transition-colors group-hover:border-foreground">
                        Read case study
                      </span>
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {projects.length > 1 && (
              <div className="mt-12 flex items-center gap-4">
                <span className="font-mono text-xs text-muted-foreground tabular-nums">
                  {String(currentIndex + 1).padStart(2, "0")} /{" "}
                  {String(projects.length).padStart(2, "0")}
                </span>
                <div className="flex flex-1 gap-2">
                  {projects.map((p, index) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => go(index)}
                      aria-label={`Go to project ${index + 1}`}
                      className="group relative h-6 flex-1"
                    >
                      <span
                        className={`absolute inset-x-0 top-1/2 h-px -translate-y-1/2 transition-colors ${
                          index === currentIndex
                            ? "bg-foreground"
                            : "bg-border group-hover:bg-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="order-1 lg:order-2">
            <div className="grid">
              {projects.map((item, index) => {
                const active = index === currentIndex;
                return (
                  <motion.div
                    key={item.id}
                    className="[grid-area:1/1]"
                    animate={{ opacity: active ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    aria-hidden={!active}
                    inert={!active ? true : undefined}
                  >
                    <Link
                      href={`/projects/${item.slug}`}
                      className="group relative block overflow-hidden border border-border"
                    >
                      <div className="relative aspect-4/3">
                        <ProjectMedia
                          imageUrl={item.image_url}
                          title={item.title}
                          className="grayscale transition duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
                        />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
